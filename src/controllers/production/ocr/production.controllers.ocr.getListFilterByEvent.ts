import {Request, Response } from 'express';
import sql                  from 'mssql';
import { Conexion }         from '../../../db/conection';
import { dbParameters }     from '../../../interfaces/db/dbInterface';
import {HttpErrorResponse } from '../../../utilities/httpErrorResponse';
import * as yup from 'yup';

interface ApiDataResponse extends ApiResponse {
    data:Array<any>
}

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
    data?:any,
    dataLength?:number;
    date?: string
}

export const getListFilterByEvent : (req:Request,res:Response)=> Promise<any> = async (req:Request,res:Response) => {


    const { event, user, page, pageSize  } = req.query;

    const opDetailSchema = yup.object().shape({
        event:yup.string().max(5).min(1),
        user: yup.string().max(20).min(5),
        page:yup.number().min(1).max(50),
        pageSize:yup.number().max(50).min(1),
    });

    const params : Array<dbParameters> = [
        {
            name:'id_anormalidad',
            type:sql.VarChar ||null,
            value: event 
        },
        {
            name: 'id_usuario',
            type: sql.VarChar,
            value: user || null
        },
        {
            name:'offset',
            type:sql.Int,
            value:page && pageSize ? (parseInt(page.toString())-1)*parseInt(pageSize.toString()):0
        },
        {
            name: 'cantidad',
            type: sql.Int,
            value: page && pageSize? pageSize :20
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

        const response : DbResponse = await db.execute('sp_gestion_ml_db_produccion_solicitud_ocr_lista_filtrada_anormalidades',params);
        // console.log(response);

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

        const apiResponse: ApiDataResponse = {
            apiCode: 1,
            apiMessage: 'Consulta exitosa',
            dataLength:response.data?.length,
            date:new Date().toDateString(),
            data:response.data
        }

        return res.status(200).json(apiResponse);
        
    } catch (error) {
        console.log(error)
    }
}
