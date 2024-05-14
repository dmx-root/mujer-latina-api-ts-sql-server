import {Request, Response } from 'express';
import { Conexion }         from '../../../db/conection';
import { HttpErrorResponse } from '../../../utilities/httpErrorResponse';

interface ApiDataResponse extends ApiResponse {
    data:Array<any>
} 

interface DbResponse {

    statusCode: 1 | 0 | -1,
    message?: string,
    data?: any
    information?: string,
    err?: HttpErrorResponse

}

interface ApiResponse {
    apiCode: -1 | 0 | 1,
    apiMessage: string,
    data?:any
}

export const getList:(req:Request,res:Response) => Promise<any> = async (req:Request,res:Response) => {

    try {
        const db = new Conexion(); 
        const response : DbResponse = await db.execute('sp_gestion_ml_db_produccion_solicitud_ocr_lista_completa');

        if(response.statusCode === 0){
            const apiResponse: ApiResponse ={
                apiCode:0,
                apiMessage: response.message || "No se obtuvo mensajes"
            }
            return res.status(404).json(apiResponse)
        }
        
        const apiResponse: ApiDataResponse = {
            apiCode:1,
            apiMessage: 'Consulta exitosa',
            data:response.data
        }
        return res.status(200).json(apiResponse);
        
    } catch (error) {
        const apiResponse: ApiResponse = {
            apiCode:-1,
            apiMessage:'Error interno en el servidor'
        }
        return res.status(500).json(apiResponse)
    }

}
