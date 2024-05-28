import {Request, Response } from 'express';
import { getUsersListWebService } from '../../../services/webservices/usuariosQueryList.service'
import * as yup             from 'yup';


interface ApiResponse {
    apiCode: -1 | 0 | 1,
    apiMessage: string,
    data?:any,
    dataLength?:number;
    date?: string
}

export const  getUserListWS: ( req:Request, res:Response )=>Promise< any > = async ( req:Request,res:Response ) => {

    const { page, pageSize } = req.query;

    const moduloSchema = yup.object().shape({
        page:yup.number().min(1).max(50),
        pageSize:yup.number().max(50).min(1),
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
        
        const user = await getUsersListWebService('-1');

        if(user.statusCode === 1 ){
            if(page && pageSize ){
                
                console.log(page,pageSize)
                const cursorFinal = parseInt(page.toString())*parseInt(pageSize.toString());
                const cursorInicial = (parseInt(page.toString())-1)*parseInt(pageSize.toString());

                const apiResponse: ApiResponse = {
                    apiCode: user.statusCode,
                    dataLength:parseInt(pageSize.toLocaleString()),
                    date: new Date().toLocaleDateString(),
                    apiMessage: user.statusMessage,
                    data: user.data.slice(cursorInicial,cursorFinal)
                }
                return res.status(200).json(apiResponse);
            }

            const apiResponse: ApiResponse = {
                apiCode: user.statusCode,
                dataLength:50,
                date: new Date().toLocaleDateString(),
                apiMessage: user.statusMessage,
                data: user.data.slice(0,49)
            }
            return res.status(200).json(apiResponse);
        }

        
    } catch (error) {
        const apiResponse: ApiResponse = {
            apiCode:-1,
            date:new Date().toDateString(),
            apiMessage:'Error interno en el servidor'
        }
        return res.status(500).json(apiResponse)
    }
}
