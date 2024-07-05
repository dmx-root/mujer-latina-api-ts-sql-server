import {Request, Response } from 'express';
import sql                  from 'mssql';
import * as yup             from 'yup';
import { Conexion }         from '../../../db/conection';
import { dbParameters }     from '../../../interfaces/db/dbInterface';
import { HttpErrorResponse } from '../../../utilities/httpErrorResponse';

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

export const insertProcessEvent: ( req:Request,res:Response )=>Promise<any> = async ( req:Request,res:Response ) => {
    const {
            ingresadoPor,
            idEvento,
            etiqueta,
        } = req.body;


    const eventProcessSchema = yup.object().shape({
        ingresadoPor:yup.string().required().max(20).min(5),
        etiqueta: yup.string().required().max(50).min(5),
        idEvento :yup.string().required().max(2).min(2)
    });

    const params : Array<dbParameters> = [
        {
            name: 'ingresado_por',
            type: sql.VarChar,
            value: ingresadoPor
        },
        {
            name: 'id_anormalidad',
            type: sql.VarChar,
            value: idEvento
        },
        {
            name: 'etiqueta',
            type: sql.VarChar,
            value: etiqueta
        },
 
    ]
    
    try {
        
        await eventProcessSchema.validate(req.body)
        
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
        
        const response : DbResponse = await db.execute('sp_gestion_ml_db_administracion_tsn_insersion_anormalidad',params);            
        
        if(response.statusCode === -1){
            const apiResponse : ApiResponse = {
                apiCode:-1,
                apiMessage: response.message || 'No se obtuvo mensajes'
            }
            return res.status(500).json(apiResponse);
        }

        if(response.statusCode === 0){
            const apiResponse : ApiResponse = {
                apiCode:0,
                apiMessage: response.message || 'No se obtuvo mensajes'
            }
            return res.status(404).json(apiResponse);
        }

        const apiResponse : ApiResponse = {
            apiCode:1,
            apiMessage: 'Consulta exitosa',
            data:response.data
        }
        return res.status(200).json(apiResponse);

    } catch (error) {
        console.log(error);
        const apiResponse : ApiResponse = {
            apiCode:-1,
            apiMessage: 'Error interno de servidor'
        }
        return res.status(500).json(apiResponse);
    }
}