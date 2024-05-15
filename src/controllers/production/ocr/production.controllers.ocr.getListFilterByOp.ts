import {Request, Response } from 'express';
import sql                  from 'mssql';
import * as yup             from 'yup';
import { Conexion }         from '../../../db/conection';
import { dbParameters }     from '../../../interfaces/db/dbInterface';
import { HttpErrorResponse } from '../../../utilities/httpErrorResponse';

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

export const getListFilterByOp : ( req:Request,res:Response ) => Promise <any> = async (req:Request,res:Response) =>{
    const { op, color, talla, page, pageSize } = req.query;

    const opDetailSchema = yup.object().shape({
        op:yup.string().required().max(500).min(5),
        color:yup.string().required().max(5).min(3),
        talla:yup.string().required().max(5).min(1),
        page:yup.number().min(1).max(50),
        pageSize:yup.number().max(50).min(1),
    });

    const params : Array<dbParameters> = [
        {
            name: 'id_op',
            type: sql.VarChar,
            value: op
        },
        
        {
            name: 'id_color',
            type: sql.VarChar,
            value: color
        },
        {
            name: 'id_talla',
            type: sql.Int,
            value: talla
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

    const db = new Conexion();

    try {
        
        await opDetailSchema.validate(req.query)

    } catch (error) {
        const errors:any=error
        const apiResponse: ApiResponse = {
            apiCode:-1,
            date:new Date().toDateString(),
            apiMessage: errors.errors[0] 
        }
        return res.status(500).json(apiResponse);
    }

    try {

        const response : DbResponse = await db.execute('sp_gestion_ml_db_produccion_solicitud_ocr_lista_filtrada_op_detalle',params);            

        if(response.statusCode === -1){
            const apiResponse : ApiResponse = {
                apiCode:0,
                date:new Date().toDateString(),
                apiMessage: response.message || "No se obtuvo mensajes"
            }
            return res.status(404).json(apiResponse);
        }

        if(response.statusCode === 0){
            const apiResponse : ApiResponse = {
                apiCode:0,
                date:new Date().toDateString(),
                apiMessage: response.message || "No se obtuvo mensajes"
            }
            return res.status(404).json(apiResponse);
        }

        const apiResponse : ApiDataResponse = {
            apiCode:1,
            apiMessage: 'Consulta exitosa',
            dataLength:response.data?.length,
            date:new Date().toDateString(),
            data: response.data
        }
        return res.status(200).json(apiResponse);

    } catch (error) {
        console.log(error);
        const apiResponse : ApiResponse = {
            apiCode:-1,
            date:new Date().toDateString(),
            apiMessage: 'Error interno de servidor'
        }
        return res.status(500).json(apiResponse);
    }

}
