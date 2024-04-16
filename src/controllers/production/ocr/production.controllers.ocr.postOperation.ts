import {Request, Response } from 'express';
import sql                  from 'mssql';
import * as yup             from 'yup';
import { Conexion }         from '../../../db/conection';
// import { ApiResponse }      from '../../../interfaces/api/response';
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


export const insertOperation: ( req:Request,res:Response )=>Promise<any> = async ( req:Request,res:Response ) => {
    const {
            inicio,
            finalizacion,
            operarioId,
            modulo,
            unidades,
            color,
            talla,
            op,
            anormalidad
        } = req.body;

    // console.log(req.body)

    const operationSchema = yup.object().shape({
        op:yup.string().required().max(500).min(5),
        color:yup.string().required().max(5).min(3),
        talla:yup.string().required().max(10).min(1),
        inicio:yup.string().required().max(20).min(5),
        finalizacion:yup.string().required().max(20).min(5),
        operarioId:yup.string().required().max(20).min(5),
        modulo:yup.number().required(),
        unidades:yup.number().required()

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
            name: 'talla',
            type: sql.VarChar,
            value: talla
        },
        {
            name: 'inicio_operacion',
            type: sql.VarChar,
            value: inicio
        },
        {
            name: 'fin_operacion',
            type: sql.VarChar,
            value: finalizacion
        },
        {
            name: 'ingresado_por',
            type: sql.VarChar,
            value: operarioId
        },
        {
            name: 'id_modulo',
            type: sql.Int,
            value: modulo
        },
        {
            name: 'cantidad',
            type: sql.Int,
            value: unidades
        },
        {
            name: 'id_anormalidad',
            type: sql.VarChar,
            value: anormalidad||null
        },
        {
            name: 'id_categoria',
            type: sql.Int,
            value: 1
        }
        
    ]

    
    try {
        
        await operationSchema.validate(req.body)
        
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
        
        const response : DbResponse = await db.execute('sp_gestion_ml_db_produccion_insercion_ocr',params);            
        
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
            apiMessage: 'Consulta exitosa'
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