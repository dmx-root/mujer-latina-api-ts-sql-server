import {Request, Response } from 'express';
import sql                  from 'mssql';
import { Conexion }         from '../../../db/conection';
import { dbParameters }     from '../../../interfaces/db/dbInterface';
import { HttpErrorResponse } from '../../../utilities/httpErrorResponse'


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

export const getListFilterByUser : ( req: Request,res: Response ) => Promise< Response > = async( req: Request,res: Response ) => {

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

        const response : DbResponse= await db.execute('sp_gestion_ml_db_produccion_solicitud_ocr_lista_filtrada_usuario',params);

        if(response.statusCode===-1){
            const apiResponse: ApiResponse= {
                apiCode: -1,
                apiMessage: response.message || "No se obtuvo mensajes",
            }

            return res.status(500).json(apiResponse);
        }
        if(response.statusCode===0){
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
