import {Request, Response } from 'express';
import sql                  from 'mssql';
import * as yup             from 'yup';
import { Conexion }         from '../../../db/conection';
import { ApiResponse }      from '../../../interfaces/api/response';
import { dbParameters }     from '../../../interfaces/db/dbInterface';
import { HttpErrorResponse } from '../../../utilities/httpErrorResponse';

interface DbResponse {

    statusCode: 1 | 0 | -1,
    message?: string,
    data?: any
    information?: string,
    err?: HttpErrorResponse,

}

export const checkElement : ( req: Request, res :Response) => Promise<any> = async (req :Request , res : Response) => {
    const {
        ocrId,
        operarioId
    } = req.body;

    const operationSchema = yup.object().shape({
        ocrId:yup.number().required(),
        operarioId:yup.string().required().max(20).min(5)

    });

    const params : dbParameters[] = [
        {
            name: 'id_ocr',
            type: sql.Int,
            value: ocrId
        },
        {
            name: 'ingresado_por',
            type: sql.VarChar,
            value: operarioId
        }
        
    ]
    try {
        
        await operationSchema.validate(req.body)

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

        const response : DbResponse = await db.execute('sp_gestion_ml_db_produccion_actualizacion_ocr_revision',params);            
        
        if(response.statusCode === -1){
            const apiResponse : ApiResponse = {
                statusCode:-1,
                message: response.message || 'No se obtuvo mensajes'
            }
            return res.status(500).json(apiResponse);
        }

        if(response.statusCode === 0){
            const apiResponse : ApiResponse = {
                statusCode:0,
                message: response.message || 'No se obtuvo mensajes'
            }
            return res.status(404).json(apiResponse);
        }

        const apiResponse : ApiResponse = {
            statusCode:1,
            message: 'Consulta exitosa'
        }
        return res.status(200).json(apiResponse);
        
    } catch (error) {
        console.log(error);
        const apiResponse : ApiResponse = {
            statusCode:-1,
            message: 'Error interno de servidor'
        }
        return res.status(500).json(apiResponse);
    }
}