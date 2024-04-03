import { HttpErrorResponse }                from '../utilities/httpErrorResponse';
import { dbParameters }                     from '../interfaces/db/dbInterface';
import { ApiResponse }                      from '../interfaces/api/response';
import { decodeToken }                      from '../helpers/userVerify';
import {Conexion}                           from '../db/conection';
import { NextFunction, Response, Request }  from 'express';
import sql                                  from 'mssql';

interface HelperResponse {
    statusCode:1 | 0 | -1,
    statusMessage: string,
    err?:Error,
    data?:any
}

interface DbResponse {
    statusCode : 1 | 0 | -1,
    message? : string,
    data? : any
    information? : string
    err? : HttpErrorResponse
}

export const verifyUser : (userId : string ) => Promise <HelperResponse> = async  (userId: string) => {

    try {
        const params : dbParameters[] = [
            {
                name : "id_usuario",
                type : sql.VarChar,
                value : userId
            }
        ]
        const db = new Conexion();

        const dbResponse : DbResponse = await db.execute('sp_gestion_ml_db_autenticacion_solicitud_usuario',params);

        if(dbResponse.statusCode !== 1){
            const response : HelperResponse = {
                statusCode: dbResponse.statusCode,
                statusMessage: dbResponse.message || "No se obtuvo mensajes",
                err : new Error(dbResponse.message?.toUpperCase())
            }
            return response;

        }

        const response : HelperResponse = {
            statusCode : 1,
            statusMessage : "Consulta exitosa",
            data : {
                roldId:dbResponse.data[0].perfil_id,
                userId
            }
        }
        return response;
        
    } catch (error) {
        const response : HelperResponse = {
            statusCode :-1,
            statusMessage : "Error de controlador",
            err : new Error("ERROR DE CONTROLADOR")
        }
        return response;
    }
}

export const verifyRoles : () => Promise <HelperResponse> = async  () => {

    try {
        const db = new Conexion();

        const dbResponse : DbResponse = await db.execute('sp_gestion_ml_db_autenticacion_solicitud_perfiles');

        if(dbResponse.statusCode !== 1){
            const response : HelperResponse = {
                statusCode: dbResponse.statusCode,
                statusMessage: dbResponse.message || "No se obtuvo mensajes",
                err : new Error(dbResponse.message?.toUpperCase())
            }
            return response;

        }

        const response : HelperResponse = {
            statusCode : 1,
            statusMessage : "Consulta exitosa",
            data : dbResponse.data
        }
        
        return response;
        
    } catch (error) {
        const response : HelperResponse = {
            statusCode :-1,
            statusMessage : "Error de controlador",
            err : new Error("ERROR DE CONTROLADOR")
        }
        return response;
    }
}


export const routesAutentication : ( rolesList : number[] ) => ( req : Request, res : Response, next : NextFunction) => Promise <Response | NextFunction | any>  = ( rolesList : number[] ) => {
    return async (  req : Request, res : Response, next : NextFunction ) => {
        const token = req.header("Authenticate-Token");

        if(!token) return res.status(403).json({
            statusCode : 0,
            message : "Token no proporcionado"
        })

        try {
            const currentUser = decodeToken(token);
            if(!currentUser.data || typeof(currentUser.data)==='string'){
                return res.status(401).json({
                    statusCode : -1,
                    message : "No se pudo obtener la sesión"
                })
            }

            const validateCurrentUser = await verifyUser(currentUser.data.userId);
            
            if(validateCurrentUser.statusCode!==1){
                const apiResponse : ApiResponse = {
                    statusCode : 0,
                    message : validateCurrentUser.statusMessage 

                }
                return res.status(404).json(apiResponse)
            }
            
            const validateRolesResponse = await verifyRoles();
            
            if( validateRolesResponse.statusCode !==1 ){
                const apiResponse : ApiResponse = {
                    statusCode : 0,
                    message : validateCurrentUser.statusMessage 

                }
                return res.status(404).json(apiResponse)
            }

            rolesList.forEach(element => {
                const cond = validateRolesResponse.data.some((role:{perfil_id: number, estado: boolean, etiqueta:string})=>element === role.perfil_id);

                if(!cond){
                    const apiResponse : ApiResponse = {
                        statusCode : -1,
                        message : "Error interno de servidor, los roles no se asignaron correctamente"
                    }
    
                    return res.status(500).json(apiResponse);
                }
            });

            const cond = rolesList.some(element => element === currentUser.data?.roleId);

            if(!cond){
                const apiResponse : ApiResponse = {
                    statusCode : 0,
                    message : "Usuario no autorizado para acceder a este recurso"
                }
    
                return res.status(403).json(apiResponse);
            }
            
            next();
        } catch (error) {
            const apiResponse :ApiResponse = {
                statusCode: -1,
                message: "Error interno de servidor, no se pudo validar la ruta solicitada"
            }
            return res.status(500).json(apiResponse)
            
        }

    }
}

