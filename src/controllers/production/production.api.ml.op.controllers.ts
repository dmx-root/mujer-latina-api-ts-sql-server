import {Request, Response } from 'express';
import sql                  from 'mssql';
import * as yup             from 'yup';
import { Conexion }         from '../../db/conection';
import { ApiResponse }      from '../../interfaces/api/response';
import { dbParameters }     from '../../interfaces/db/dbInterface';
import { getOpWebService } from '../../services/webservices/opQuery.service';

interface ApiDataResponse extends ApiResponse {
    data:Array<any>
} 


export class ProductionOpControllers {

    async getList(req:Request,res:Response):Promise<any>{

        interface ApiDataResponse extends ApiResponse {
            data:Array<any>
        }

        try {
            const db = new Conexion(); 
            const response:Array<any> = await db.execute('sp_gestion_ml_db_produccion_solicitud_op_lista_completa');
            
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
                name:'id_op',
                type:sql.VarChar,
                value:id
            }
        ];
        try {
            const db = new Conexion();

            const response:Array<any> = await db.execute('sp_gestion_ml_db_produccion_solicitud_op',params);
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

    async getDetails(req:Request,res:Response):Promise<any>{

        const { id } = req.params;
        
        const params:Array<dbParameters> =[
            {
                name:'id_op',
                type:sql.VarChar,
                value:id
            }
        ];
        try {
            const db = new Conexion();

            const response:Array<any> = await db.execute('sp_gestion_ml_db_produccion_solicitud_op_detalle_lista',params);

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

    async getListFilterByReference(req:Request,res:Response):Promise<any>{

        const { id } = req.params;
        
        const params:Array<dbParameters> =[
            {
                name:'referencia',
                type:sql.VarChar,
                value:id
            }
        ];
        try {
            const db = new Conexion();

            const response:Array<any> = await db.execute('sp_gestion_ml_db_produccion_solicitud_op_lista_filtrada_referencia',params);

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

    async getListFilterByType(req:Request,res:Response):Promise<any>{

        const { id } = req.params;
        console.log(id)
        const params:Array<dbParameters> =[
            {
                name:'tipo_op',
                type:sql.VarChar,
                value:id
            }
        ];
        try {
            const db = new Conexion();

            const response:Array<any> = await db.execute('sp_gestion_ml_db_produccion_solicitud_op_lista_filtrada_tipo',params);

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
    
    async getListFilterByProcesseState(req:Request,res:Response):Promise<any>{

        const { id } = req.params;
        console.log(id)
        const params:Array<dbParameters> =[
            {
                name:'id_estado',
                type:sql.Int,
                value:id
            }
        ];
        try {
            const db = new Conexion();

            const response:Array<any> = await db.execute('sp_gestion_ml_db_produccion_solicitud_op_lista_filtrada_cierre_proceso',params);

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

            const response:Array<any> = await db.execute('sp_gestion_ml_db_produccion_solicitud_op_lista_filtrada_usuario',params);

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

    async insertListDetailOp(req : Request, res : Response) : Promise <any> {

        const { id } = req.params;
        // console.log(op)
        try {
            const params : dbParameters[] = [
                {
                    name:'id_op',
                    type: sql.VarChar,
                    value: id
                }
            ];

            const db = new Conexion();

            const response  = await db.execute('sp_gestion_ml_db_produccion_solicitud_op',params);
            console.log(response)
            const apiResponse : ApiDataResponse = {
                statusCode: 1,
                message: 'Consulta exitosa',
                data: response.data
            }

            return res.status(200).json(apiResponse);
            // const respose = await getOpWebService(id);

        } catch (error) {
            console.log(error)
            const apiResponse : ApiResponse = {
                statusCode : -1,
                message: 'Error interno de servidor'
            }

            return res.status(500).json(apiResponse);
        }
    }

}