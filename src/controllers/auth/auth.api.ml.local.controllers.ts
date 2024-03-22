import { getUserWebService }    from "../../services/webservices/usuariosQuery.service";
import { HttpErrorResponse }    from "../../utilities/httpErrorResponse";
import { dbParameters }         from "../../interfaces/db/dbInterface";
import { encryptPassword }      from "../../helpers/passwordEncrypt";
import { comparePassword }      from '../../helpers/passwordCompare';
import { ApiResponse }          from '../../interfaces/api/response';
import { userSign }             from "../../helpers/userSign";
import { Conexion }             from "../../db/conection";
import { Request, Response }    from "express";
import * as yup                 from 'yup';
import sql                      from 'mssql';

interface DbResponse {

    statusCode: 1 | 0 | -1,
    message?: string,
    data?:any
    information?:string,
    err?:HttpErrorResponse

}

interface ApiDataResponse extends ApiResponse {
    data:any
}

interface DataUser {
    nombre:string,
    documento_id:string,
    contrasena: string,
    descripcion:string,
    estado: boolean,
    tipo_documento_id: number,
    tipo_documento_etiqueta: string,
    perfil_id: number,
    perfil_etiqueta: string
}

export class AuthLocalControllers{

    async login(req:Request, res:Response){
        const {
            documentoId,
            clave,
            perfil,
            documentoTipoId,
            usuario
        } = req.body;

        const schema = yup.object().shape({
            documentoId:yup.string().required().min(5).max(20),
            clave: yup.string().required().min(4).max(100),
            perfil:yup.number().required(),
            documentoTipoId: yup.number().required(),
            usuario: yup.string().required().min(5).max(20)
        })

        try {
            await schema.validate(req.body)

        } catch (error) {
            const errors:any=error
            const apiResponse: ApiResponse = {
                statusCode:-1,
                message: errors.errors[0] 
            }
            return res.status(500).json(apiResponse);
        }

        try {
            const user = await getUserWebService(documentoId);

            if(user.statusCode !== 1 ){
                const apiResponse: ApiResponse = {
                    statusCode: user.statusCode,
                    message: user.statusMessage
                }
                return res.status(404).json(apiResponse);
            }
            
            const password = await encryptPassword(clave);
            
            if(password.statusCode !== 1){
                const apiResponse: ApiResponse = {
                    statusCode: password.statusCode,
                    message: password.statusMessage
                }
                return res.status(500).json(apiResponse);
            }

            const params : Array<dbParameters> = [
                {
                    name:'id_usuario',
                    type: sql.Int,
                    value: documentoId
                },
                {
                    name:'nombre',
                    type: sql.VarChar,
                    value: user.data.userName
                },
                {
                    name:'contrasena',
                    type: sql.VarChar,
                    value: password.data
                },
                {
                    name:'descripcion',
                    type: sql.VarChar,
                    value: user.data.description
                },
                {
                    name:'id_perfil',
                    type: sql.Int,
                    value: perfil
                },
                {
                    name:'id_tipo_documento',
                    type: sql.Int,
                    value: documentoTipoId
                },
                {
                    name:'ingresado_por',
                    type: sql.VarChar,
                    value: usuario
                },
                
            ]

            const db = new Conexion();

            const response : DbResponse = await db.execute('sp_gestion_ml_db_autenticacion_insercion_usuario', params);

            if( response.statusCode === 0){
                const apiResponse : ApiResponse = {
                    statusCode: 0,
                    message: response.message || 'No se pudo obtener la información'
                }
                return res.status(404).json(apiResponse);
            }

            if( response.statusCode === -1){
                const apiResponse : ApiResponse = {
                    statusCode: 0,
                    message: response.message || 'No se pudo obtener la información'
                }
                return res.status(404).json(apiResponse);
            }

            const apiResponse : ApiDataResponse = {
                statusCode:1,
                message:response.message || 'Consulta Exitosa',
                data:response.data
            }
            return res.status(200).json(apiResponse)
            
        } catch (error) {
            console.log(error)
            const apiResponse : ApiResponse = {
                statusCode:-1,
                message:'Error interno de servidor'
            }
            return res.status(500).json(apiResponse)
        }
    }

    async signIn(req:Request, res:Response){
        const {
            documentoId,
            clave
        } = req.body;

        const schema = yup.object().shape({
            documentoId:yup.string().required().min(5).max(20),
            clave: yup.string().required().min(4).max(100),
        });
        
        try {
            await schema.validate(req.body)

        } catch (error) {
            const errors:any=error
            const apiResponse: ApiResponse = {
                statusCode:-1,
                message: errors.errors[0] 
            }
            return res.status(500).json(apiResponse);
        }

        try {
            const db = new Conexion();

            const params : Array<dbParameters> =[
                {
                    name: 'id_usuario',
                    type: sql.VarChar,
                    value: documentoId
                }
            ];

            const response : DbResponse = await db.execute('sp_gestion_ml_db_autenticacion_solicitud_usuario',params);

            if( response.statusCode === 0){
                const apiResponse : ApiResponse = {
                    statusCode: 0,
                    message: 'Documento incorrecto'
                }
                return res.status(404).json(apiResponse);
            }
            
            if( response.statusCode === -1){
                const apiResponse : ApiResponse = {
                    statusCode: 0,
                    message: response.message || 'No se obtuvo mensajes'
                }
                return res.status(404).json(apiResponse);
            }

            const compare = await comparePassword(response.data.contrasena,clave);

            if(compare.statusCode === 0){
                const apiResponse : ApiResponse = {
                    statusCode: 0,
                    message: 'Contraseña incorrecta'
                }
                return res.status(404).json(apiResponse);
            }

            if(compare.statusCode === -1){
                const apiResponse : ApiResponse = {
                    statusCode: -1,
                    message: compare.statusMessage
                }
                return res.status(500).json(apiResponse);
            }
            // const token = await userSign({
            //     userId:     response.data.usr_documento_id,
            //     userName:   response.data.nombre,
            //     roleId:     response.data.perfil_id,
            //     roleName:   response.data.perfil_etiqueta
            // });

            // console.log(token)

            const apiResponse : ApiDataResponse = {
                statusCode: 1,
                message: 'Consulta exitosa',
                data: response.data
            }

            return res.status(200).json(apiResponse);
        } catch (error) {
            
        }
    }
}