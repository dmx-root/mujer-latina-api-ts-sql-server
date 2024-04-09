import {Request, Response } from 'express';
import sql                  from 'mssql';
import { Conexion }         from '../../../db/conection';
// import { ApiResponse }      from '../../../interfaces/api/response';
import { dbParameters }     from '../../../interfaces/db/dbInterface';
import { HttpErrorResponse } from "../../../utilities/httpErrorResponse";
import * as yup from "yup"


interface DbResponse {

    statusCode: 1 | 0 | -1,
    message?: string,
    data?: any
    information?: string,
    err?: HttpErrorResponse,

}
interface ApiResponse {
    apiCode: -1 | 0 | 1,
    apiMessage: string,
    data?:any
}


export const  getListFilterByCheckState : ( req:Request,res:Response )=>Promise<any> = async ( req:Request,res:Response ) => {


    const { state, user } = req.query;

    const opDetailSchema = yup.object().shape({
        state:yup.number().required(),
        user:yup.string().max(20).min(5),
    });

    const params : Array<dbParameters> = [
        {
            name:'id_estado',
            type:sql.Int,
            value:state
        },
        {
            name: 'id_usuario',
            type: sql.VarChar,
            value: user || null
        }
        
    ]

    try {
        
        await opDetailSchema.validate(req.query)

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

        const response : DbResponse = await db.execute('sp_gestion_ml_db_produccion_solicitud_ocr_lista_filtrada_estado_revision',params);

        if(response.statusCode === -1){
            const apiResponse: ApiResponse= {
                apiCode: -1,
                apiMessage: response.message || "No se obtuvo mensajes",
            }

            return res.status(500).json(apiResponse);
        }

        if(response.statusCode === 0){
            const apiResponse: ApiResponse= {
                apiCode: 0,
                apiMessage: response.message || "No se obtuvo mensajes",

            }

            return res.status(404).json(apiResponse);
        }

        const apiResponse: ApiResponse = {
            apiCode: 1,
            apiMessage: 'Consulta exitosa',
            data:response.data
        }

        return res.status(200).json(apiResponse);
        
    } catch (error) {
        const apiResponse: ApiResponse= {
            apiCode: -1,
            apiMessage: "Error interno de servidor",
        }

        return res.status(500).json(apiResponse);
    }
}
