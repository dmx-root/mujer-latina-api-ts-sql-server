import { dbParameters }         from '../../../interfaces/db/dbInterface';
import { HttpErrorResponse }    from '../../../utilities/httpErrorResponse';
import { Conexion }             from '../../../db/conection';
import {Request, Response }     from 'express';
import sql                      from 'mssql';
import * as yup                 from 'yup';
import { userFieldValidator }   from '../../../helpers/userFieldsValidator'

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
    data?: any,
    information?: string,
    err?: HttpErrorResponse
}

export const  updateUser: ( req:Request, res:Response )=>Promise< any > = async ( req:Request,res:Response ) => {
    
    const { usuario, campo, valor, ingresadoPor } = req.body;
    // console.log(req.body)
    const moduloSchema = yup.object().shape({
        usuario:      yup.string().min(5).max(20).required("No se obtuvo el ID del usuario").strict(), 
        campo:        yup.string().min(2).max(50).required("No se obtuvo el campo que desea modificar").strict(), 
        ingresadoPor: yup.string().min(5).max(20).required("No se obtuvo el ID de la persona que está realizando la acción").strict()
    });

    try {
        await moduloSchema.validate(req.body);
        const response = await userFieldValidator({field:campo,value:valor});
        if(response.apiCode!==1){
            return res.status(response.status).json(response);
        }

    } catch (error) {
        const errors:any=error
        const apiResponse: ApiResponse = {
            apiCode:-1,
            apiMessage: errors.errors[0] 
        }
        return res.status(500).json(apiResponse);
    }
    try {
        
        const params : Array<dbParameters> = [
            {
                name:'id_usuario',
                type:sql.Int,
                value:usuario
            },
            {
                name: 'campo_a_actualizar',
                type: sql.NVarChar,
                value: campo
            },  
            {
                name: 'valor_nuevo',
                type: sql.NVarChar,
                value: valor.toString()
            },  
            {
                name: 'ingresado_por',
                type: sql.VarChar,
                value: ingresadoPor
            },  
        ];


        const db = new Conexion();

        const response : DbResponse = await db.execute('sp_gestion_ml_db_administracion_actualizacion_usuario',params);

        if(response.statusCode === -1){
            const apiResponse: ApiResponse= {
                apiCode: -1,
                date:new Date().toLocaleDateString(),
                apiMessage: response.message ||'No se obtuvo mensajes',
            }

            return res.status(500).json(apiResponse);
        }

        if(response.statusCode === 0){
            const apiResponse: ApiResponse= {
                apiCode: 0,
                date:new Date().toLocaleDateString(),
                apiMessage: response.message ||'No se obtuvo mensajes',
            }

            return res.status(404).json(apiResponse);
        }

        const apiResponse: ApiResponse = {
            apiCode: 1,
            apiMessage: 'Consulta exitosa',
            dataLength:response.data?.length,
            date:new Date().toLocaleDateString(),
            data:response.data
        }

        return res.status(200).json(apiResponse);

    } catch (error) {
        const apiResponse: ApiResponse = {
            apiCode:-1,
            date:new Date().toLocaleDateString(),
            apiMessage:'Error interno en el servidor'
        }
        return res.status(500).json(apiResponse)
    }
}