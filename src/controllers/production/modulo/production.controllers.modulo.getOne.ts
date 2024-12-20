import {Request, Response } from 'express';
import sql                  from 'mssql';
import { Conexion }         from '../../../db/conection';
import { ApiResponse }      from '../../../interfaces/api/response';
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
    err?: HttpErrorResponse
}

export const getOne : (req:Request,res:Response) => Promise<any> = async (req:Request,res:Response) => {

    const { id } = req.params;
    
    const params:Array<dbParameters> =[
        {
            name:'id_modulo',
            type:sql.BigInt,
            value:id
        }
    ];
    try {
        const db = new Conexion();

        const response : DbResponse = await db.execute('sp_gestion_ml_db_produccion_solicitud_modulo',params);

        if(response.statusCode === -1){
            const apiResponse: ApiResponse= {
                statusCode: -1,
                message: response.message || 'No se Obtuvo mensajes',
            }

            return res.status(500).json(apiResponse);
        }

        if(response.statusCode === 0){
            const apiResponse: ApiResponse= {
                statusCode: 0,
                message: response.message || 'No se Obtuvo mensajes',
            }

            return res.status(404).json(apiResponse);
        }

        const apiResponse: ApiDataResponse = {
            statusCode: 1,
            message: 'Consulta exitosa',
            data:response.data
        }

        return res.status(200).json(apiResponse);
        
    } catch (error) {
        console.log(error)
        const apiResponse: ApiResponse= {
            statusCode: -1,
            message: "Error interno de servidor",
        }

        return res.status(500).json(apiResponse);
    }
}
