import {Request, Response } from 'express';
import sql                  from 'mssql';
import * as yup             from 'yup';
import { Conexion }         from '../../db/conection';
import { ApiResponse }      from '../../interfaces/api/response';
import { dbParameters }     from '../../interfaces/db/dbInterface';

interface ApiDataResponse extends ApiResponse {
    data:Array<any>
} 

export class ProductionModuloControllers {

    async getList(req:Request,res:Response):Promise<any>{
        
        try {

            const db = new Conexion(); 

            const response:Array<any> = await db.execute('sp_gestion_ml_db_produccion_solicitud_modulos_lista_completa');
            
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
                name:'id_modulo',
                type:sql.BigInt,
                value:id
            }
        ];
        try {
            const db = new Conexion();

            const response:Array<any> = await db.execute('sp_gestion_ml_db_produccion_solicitud_modulo',params);

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

    async getListFilterByState(req:Request,res:Response):Promise<any>{
        const { id } = req.params;
        
        const params:Array<dbParameters> =[
            {
                name:'id_estado_modulo',
                type:sql.Int,
                value:id
            }
        ];
        try {
            const db = new Conexion();

            const response:Array<any> = await db.execute('sp_gestion_ml_db_produccion_solicitud_modulos_lista_filtrada_operacion_estado',params);

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

}