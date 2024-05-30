import {Request, Response } from 'express';
import sql                  from 'mssql';
import { Conexion }         from '../../../db/conection';
import { dbParameters }     from '../../../interfaces/db/dbInterface';
import { HttpErrorResponse } from '../../../utilities/httpErrorResponse';

interface ApiResponse {
    apiCode: -1 | 0 | 1,
    apiMessage: string,
    data?:any,
    dataLength?:number;
    date?: string
}

interface DbResponse {

    statusCode: 1 | 0 | -1,
    message?: string,
    data?: any
    information?: string,
    err?: HttpErrorResponse

}

export const  getOne: ( req:Request, res:Response )=>Promise< any > = async ( req:Request,res:Response ) => {

    const { id } = req.params;
    
    const params:Array<dbParameters> =[
        {
            name:'id_usuario',
            type:sql.VarChar,
            value:id
        }
    ];
    try {
        const db = new Conexion();

        const response : DbResponse = await db.execute('sp_gestion_ml_db_administracion_solicitud_usuario',params);

        if(response.statusCode === -1){
            const apiResponse: ApiResponse= {
                apiCode: -1,
                apiMessage: response.message || "No se obtuvieron mensajes",
            }

            return res.status(500).json(apiResponse);
        }

        if(response.statusCode === 0){
            const apiResponse: ApiResponse= {
                apiCode: 0,
                apiMessage: 'No se encontraron elementos',
            }

            return res.status(404).json(apiResponse);
        }

        const apiResponse: ApiResponse = {
            apiCode: 1,
            apiMessage: 'Consulta exitosa',
            dataLength: 1,
            date:new Date().toLocaleDateString(),
            data:response.data
        }

        return res.status(200).json(apiResponse);
        
    } catch (error) {

        const apiResponse: ApiResponse= {
            apiCode: -1,
            apiMessage: "Error interno de servidor",
            date:new Date().toLocaleDateString(),
        }

        return res.status(500).json(apiResponse);
    }
}
