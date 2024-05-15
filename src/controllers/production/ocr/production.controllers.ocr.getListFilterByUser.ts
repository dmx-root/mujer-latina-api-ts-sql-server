import {Request, Response } from 'express';
import sql                  from 'mssql';
import { Conexion }         from '../../../db/conection';
import { dbParameters }     from '../../../interfaces/db/dbInterface';
import { HttpErrorResponse } from '../../../utilities/httpErrorResponse';
import * as yup from 'yup';

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

export const getListFilterByUser : ( req: Request,res: Response ) => Promise< Response > = async( req: Request,res: Response ) => {

    const { user, page, pageSize  } = req.query;

    const query = yup.object().shape({
        user:yup.string().max(20).min(5),
        page:yup.number().min(1).max(50),
        pageSize:yup.number().max(50).min(1),
    });
    
    const params:Array<dbParameters> =[
        {
            name:'id_usuario',
            type:sql.VarChar,
            value:user
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
    ];
    try {
        
        await query.validate(req.query)

    } catch (error) {
        const errors:any=error
        const apiResponse: ApiResponse = {
            apiCode:-1,
            apiMessage: errors.errors[0],
            date:new Date().toDateString(),

        }
        return res.status(500).json(apiResponse);
    }

    try {
        const db = new Conexion();

        const response : DbResponse= await db.execute('sp_gestion_ml_db_produccion_solicitud_ocr_lista_filtrada_usuario',params);

        if(response.statusCode===-1){
            const apiResponse: ApiResponse= {
                apiCode: -1,
                apiMessage: response.message || "No se obtuvo mensajes",
                date:new Date().toDateString(),

            }

            return res.status(500).json(apiResponse);
        }
        if(response.statusCode===0){
            const apiResponse: ApiResponse= {
                apiCode: 0,
                apiMessage: response.message || "No se obtuvo mensajes",
                date:new Date().toDateString(),

            }

            return res.status(404).json(apiResponse);
        }

        const apiResponse: ApiResponse = {
            apiCode: 1,
            apiMessage: 'Consulta exitosa',
            dataLength:response.data?.length,
            date:new Date().toDateString(),
            data:response.data
        }

        return res.status(200).json(apiResponse);
        
    } catch (error) {
        const apiResponse: ApiResponse= {
            apiCode: -1,
            apiMessage: "Error interno de servidor",
            date:new Date().toDateString(),
        }

        return res.status(500).json(apiResponse);
    }
}
