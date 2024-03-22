import {Request, Response } from 'express';
import sql                  from 'mssql';
import * as yup             from 'yup';
import { Conexion }         from '../../db/conection';
import { ApiResponse }      from '../../interfaces/api/response';
import { dbParameters }     from '../../interfaces/db/dbInterface';

interface ApiDataResponse extends ApiResponse {
    data:Array<any>
} 

export class ProductionOcrControllers {

    async getList(req:Request,res:Response):Promise<any>{

        try {
            const db = new Conexion(); 
            const response:Array<any> = await db.execute('sp_gestion_ml_db_produccion_solicitud_ocr_lista_completa');
            
            if(response.length===0){
                const apiResponse: ApiResponse ={
                    statusCode:0,
                    message:'No se obtuvieron los elementos'
                }
                return res.status(404).json(apiResponse)
            }
            const apiResponse: ApiDataResponse = {
                statusCode:1,
                message: 'Consulta exitosa',
                data:response
            }
            return res.status(200).json(apiResponse);
            
        } catch (error) {
            const apiResponse: ApiResponse = {
                statusCode:-1,
                message:'Error interno en el servidor'
            }
            return res.status(500).json(apiResponse)
        }

    }

    async getOne(req:Request,res:Response):Promise<any>{

        const { id } = req.params;
        
        const params:Array<dbParameters> =[
            {
                name:'id_ocr',
                type:sql.BigInt,
                value:id
            }
        ];
        try {
            const db = new Conexion();

            const response:Array<any> = await db.execute('sp_gestion_ml_db_produccion_solicitud_ocr',params);
            // console.log(response);

            if(response.length===0){
                const apiResponse: ApiResponse= {
                    statusCode: 0,
                    message: 'No se encontraron elementos',
                }

                return res.status(200).json(apiResponse);
            }

            const apiResponse: ApiDataResponse = {
                statusCode: 1,
                message: 'Consulta exitosa',
                data:response
            }

            return res.status(200).json(apiResponse);
            
        } catch (error) {
            console.log(error)
        }
    }

    async getListFilterByOp(req:Request,res:Response):Promise<any>{
        const { op, color, talla } = req.query;

        const opDetailSchema = yup.object().shape({
            op:yup.string().required().max(500).min(5),
            color:yup.string().required().max(5).min(3),
            talla:yup.string().required().max(5).min(1)
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
            
        ]

        const db = new Conexion();

        try {
            
            await opDetailSchema.validate(req.query)

        } catch (error) {
            const errors:any=error
            const apiResponse: ApiResponse = {
                statusCode:-1,
                message: errors.errors[0] 
            }
            return res.status(500).json(apiResponse);
        }

        try {

            const response : Array<any> = await db.execute('sp_gestion_ml_db_produccion_solicitud_ocr_lista_filtrada_op_detalle',params);            
            
            if(response.length===0){
                const apiResponse : ApiResponse = {
                    statusCode:0,
                    message: 'No se encontraron datos'
                }
                return res.status(404).json(apiResponse);
            }

            const apiResponse : ApiDataResponse = {
                statusCode:1,
                message: 'Consulta exitosa',
                data: response
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

    async getListFilterByModulo(req:Request,res:Response):Promise<any>{

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

            const response:Array<any> = await db.execute('sp_gestion_ml_db_produccion_solicitud_ocr_lista_filtrada_modulo',params);

            if(response.length===0){
                const apiResponse: ApiResponse= {
                    statusCode: 0,
                    message: 'No se encontraron elementos',
                }

                return res.status(200).json(apiResponse);
            }

            const apiResponse: ApiDataResponse = {
                statusCode: 1,
                message: 'Consulta exitosa',
                data:response
            }

            return res.status(200).json(apiResponse);
            
        } catch (error) {
            console.log(error)
        }  
    }

    async getListFilterByCheckState(req:Request,res:Response):Promise<any>{

        const { id } = req.params;
        
        const params:Array<dbParameters> =[
            {
                name:'id_estado_revision',
                type:sql.Int,
                value:id
            }
        ];
        console.log(id)
        try {
            const db = new Conexion();

            const response:Array<any> = await db.execute('sp_gestion_ml_db_produccion_solicitud_ocr_lista_filtrada_estado_revision',params);

            if(response.length===0){
                const apiResponse: ApiResponse= {
                    statusCode: 0,
                    message: 'No se encontraron elementos',
                }

                return res.status(200).json(apiResponse);
            }

            const apiResponse: ApiDataResponse = {
                statusCode: 1,
                message: 'Consulta exitosa',
                data:response
            }

            return res.status(200).json(apiResponse);
            
        } catch (error) {
            console.log(error)
        }
    }

    async getListFilterByEvent(req:Request,res:Response):Promise<any>{

        const { id } = req.params;
        
        const params:Array<dbParameters> =[
            {
                name:'id_anormalidad',
                type:sql.BigInt,
                value:id
            }
        ];
        try {
            const db = new Conexion();

            const response:Array<any> = await db.execute('sp_gestion_ml_db_produccion_solicitud_ocr_lista_filtrada_anormalidades',params);
            // console.log(response);

            if(response.length===0){
                const apiResponse: ApiResponse= {
                    statusCode: 0,
                    message: 'No se encontraron elementos',
                }

                return res.status(200).json(apiResponse);
            }

            const apiResponse: ApiDataResponse = {
                statusCode: 1,
                message: 'Consulta exitosa',
                data:response
            }

            return res.status(200).json(apiResponse);
            
        } catch (error) {
            console.log(error)
        }
    }

    async getListFilterByCategory(req:Request,res:Response):Promise<any>{

        const { id } = req.params;
        
        const params:Array<dbParameters> =[
            {
                name:'id_categoria',
                type:sql.Int,
                value:id
            }
        ];
        try {
            const db = new Conexion();

            const response:Array<any> = await db.execute('sp_gestion_ml_db_produccion_solicitud_ocr_lista_filtrada_categoria',params);
            // console.log(response);

            if(response.length===0){
                const apiResponse: ApiResponse= {
                    statusCode: 0,
                    message: 'No se encontraron elementos',
                }

                return res.status(200).json(apiResponse);
            }

            const apiResponse: ApiDataResponse = {
                statusCode: 1,
                message: 'Consulta exitosa',
                data:response
            }

            return res.status(200).json(apiResponse);
            
        } catch (error) {
            console.log(error)
        }
    }

    async getListFilterByUser(req:Request,res:Response):Promise<any>{

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

            const response:Array<any> = await db.execute('sp_gestion_ml_db_produccion_solicitud_ocr_lista_filtrada_usuario',params);

            if(response.length===0){
                const apiResponse: ApiResponse= {
                    statusCode: 0,
                    message: 'No se encontraron elementos',
                }

                return res.status(200).json(apiResponse);
            }

            const apiResponse: ApiDataResponse = {
                statusCode: 1,
                message: 'Consulta exitosa',
                data:response
            }

            return res.status(200).json(apiResponse);
            
        } catch (error) {
            console.log(error)
        }
    }

    async insertOperation(req:Request,res:Response):Promise<any>{
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

        const operationSchema = yup.object().shape({
            op:yup.string().required().max(500).min(5),
            color:yup.string().required().max(5).min(3),
            talla:yup.string().required().max(5).min(1),
            inicio:yup.string().required().max(10).min(5),
            finalizacion:yup.string().required().max(10).min(5),
            operarioId:yup.string().required().max(20).min(5),
            modulo:yup.number().required(),
            unidades:yup.number().required(),
            anormalidad: yup.string().max(5).min(2),

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

        const db = new Conexion();

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

            const response : Array<any> = await db.execute('sp_gestion_ml_db_produccion_insercion_ocr',params);            
            
            if(response.length===0){
                const apiResponse : ApiResponse = {
                    statusCode:0,
                    message: 'No se encontraron datos'
                }
                return res.status(404).json(apiResponse);
            }

            const apiResponse : ApiDataResponse = {
                statusCode:1,
                message: 'Consulta exitosa',
                data: response
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
    
}