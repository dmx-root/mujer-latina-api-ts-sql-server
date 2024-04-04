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

export const authByToken : ( req:Request, res:Response ) => Promise <any> = async (req:Request, res:Response) => {
    const { id } = req.params;

    const schema = yup.object().shape({
        documentoId: yup.string().min(5).max(20)
    });
    
    try {
        await schema.validate(req.query)

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
                value: id
            }
        ];

        const response : DbResponse = await db.execute('sp_gestion_ml_db_administracion_solicitud_usuario',params);

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

        const apiResponse : ApiResponse = {
            apiCode: 1,
            apiMessage: 'Consulta exitosa',
            data: response.data
        }
        return res.status(200).json(apiResponse);
    } catch (error) {
        
    }
}