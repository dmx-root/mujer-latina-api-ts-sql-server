import { HttpErrorResponse }    from "../../../utilities/httpErrorResponse";
import { dbParameters }         from "../../../interfaces/db/dbInterface";
import { comparePassword }      from '../../../helpers/passwordCompare';
// import { ApiResponse }          from '../../../interfaces/api/response';
import { userSign }             from '../../../helpers/userSign';
import { Conexion }             from "../../../db/conection";
import { Request, Response }    from "express";
import sql                      from 'mssql';
import * as yup                 from 'yup';

interface DbResponse {
    statusCode : 1 | 0 | -1,
    message? : string,
    data? : any
    information? : string
    err? : HttpErrorResponse
}

interface ApiResponse {
    apiCode: -1 | 0 | 1,
    apiMessage: string,
    data?:any
}

export const login : ( req : Request, res : Response ) => Promise <any> = async (req:Request, res:Response) => {

    const documentoId = req.headers['documento-id'];
    const clave = req.headers['clave'];

    const schema = yup.object().shape({
        documentoId: yup.string().required().min(5).max(20),
        clave: yup.string().required().min(4).max(100),
    });
    
    try {
        await schema.validate({
            documentoId,
            clave
        })

    } catch (error) {
        const errors:any=error
        const apiResponse: ApiResponse = {
            apiCode:-1,
            apiMessage: errors.errors[0] 
        }
        return res.status(500).json(apiResponse);
    }

    try {
        const db = new Conexion();

        const params : Array <dbParameters> =[
            {
                name: 'id_usuario',
                type: sql.VarChar,
                value: documentoId
            }
        ];

        const response : DbResponse = await db.execute('sp_gestion_ml_db_autenticacion_solicitud_usuario',params);

        if( response.statusCode === 0){
            const apiResponse : ApiResponse = {
                apiCode: 0,
                apiMessage: 'Documento incorrecto'
            }
            return res.status(404).json(apiResponse);
        }
        
        if( response.statusCode === -1){
            const apiResponse : ApiResponse = {
                apiCode: 0,
                apiMessage: response.message || 'No se obtuvo mensajes'
            }
            return res.status(404).json(apiResponse);
        }
        if( typeof(clave) !== 'string'){
            const apiResponse : ApiResponse = {
                apiCode: 0,
                apiMessage: response.message || 'No se obtuvo mensajes'
            }
            return res.status(404).json(apiResponse);
        }

        const compare = await comparePassword(response.data[0].contrasena,clave);
        if(compare.statusCode === 0){
            const apiResponse : ApiResponse = {
                apiCode: 0,
                apiMessage: 'Contraseña incorrecta'
            }
            return res.status(404).json(apiResponse);
        }

        if(compare.statusCode === -1){
            const apiResponse : ApiResponse = {
                apiCode: -1,
                apiMessage: compare.statusMessage
            }
            return res.status(500).json(apiResponse);
        }
        const token = await userSign({
            userId:             response.data[0].documento_id,
            userName:           response.data[0].nombre,
            userDescription:    response.data[0].descripcion,
            roleId:             response.data[0].perfil_id,
            roleName:           response.data[0].perfil_etiqueta,
            documentTypeId:     response.data[0].tipo_documento_id,
            docuementTypeName:  response.data[0].tipo_documento_etiqueta
        });

        const apiResponse : ApiResponse = {
            apiCode: 1,
            apiMessage: 'Consulta exitosa',
            data: response.data
        }

        return res.status(200).setHeader('Authorization-Token',token).json(apiResponse);
    } catch (error) {
              
        const apiResponse : ApiResponse = {
            apiCode: 1,
            apiMessage: 'Error interno de servidor'
        }
        return res.status(500).json(apiResponse); 
    }
}