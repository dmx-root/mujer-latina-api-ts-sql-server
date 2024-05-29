import {Request, Response } from 'express';
import { getUserWebService } from '../../../services/webservices/usuariosQuery.service'

interface ApiResponse {
    apiCode: -1 | 0 | 1,
    apiMessage: string,
    data?:any,
    dataLength?:number;
    date?: string
}

export const  getUserWS: ( req:Request, res:Response )=>Promise< any > = async ( req:Request,res:Response ) => {

    const id = req.params;

    try {
        const user = await getUserWebService(id.toString())

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
