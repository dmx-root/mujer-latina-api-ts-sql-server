import {Request, Response } from 'express';
import { getUserWebService } from '../../../services/webservices/usuariosQuery.service';
import * as yup from 'yup';

interface ApiResponse {
    apiCode: -1 | 0 | 1,
    apiMessage: string,
    data?:any,
    dataLength?:number;
    date?: string
}

export const  getUserWS: ( req:Request, res:Response )=>Promise< any > = async ( req:Request,res:Response ) => {

    const { documentoId } = req.query;

    console.log(documentoId)

    const moduloSchema = yup.object().shape({
        documentoId:yup.string().min(5).max(20).required()
    });

    try {
        await moduloSchema.validate(req.query)

    } catch (error) {
        const errors:any=error
        const apiResponse: ApiResponse = {
            apiCode:-1,
            apiMessage: errors.errors[0] 
        }
        return res.status(500).json(apiResponse);
    }

    try {
        const user = await getUserWebService(documentoId?.toString()||'')

        if(user.statusCode === -1 ){
            const apiResponse: ApiResponse = {
                apiCode: 0,
                date: new Date().toLocaleDateString(),
                apiMessage: 'No se encontró el usuario solicitado',
            }
            return res.status(404).json(apiResponse);
        }
       
        const apiResponse: ApiResponse = {
            apiCode: user.statusCode,
            dataLength:1,
            date: new Date().toLocaleDateString(),
            apiMessage: user.statusMessage,
            data: user.data
        }
        return res.status(200).json(apiResponse);
        
    } catch (error) {
        const apiResponse: ApiResponse = {
            apiCode:-1,
            date:new Date().toDateString(),
            apiMessage:'Error interno en el servidor'
        }
        return res.status(500).json(apiResponse)
    }
}
