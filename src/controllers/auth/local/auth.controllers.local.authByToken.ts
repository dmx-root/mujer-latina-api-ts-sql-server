import { HttpErrorResponse }    from "../../../utilities/httpErrorResponse";
import { Request, Response }    from "express";
import { decodeToken } from "../../../helpers/userVerify"
interface DbResponse {
    statusCode : 1 | 0 | -1,
    message? : string,
    data? : any
    information? : string
    err? : HttpErrorResponse
}

interface ApiResponse {
    apiCode: -1 | 0 | 1,
    apiMessage: string,
    data?:any
}

export const authByToken : ( req:Request, res:Response ) => Promise <any> = async (req:Request, res:Response) => {

    try {
        const token = req.header("Authenticate-Token");

        if(!token) return res.status(403).json({
            apiCode : 0,
            apiMessage : "Token no proporcionado"
        })

        const currentUser = decodeToken(token);

        if(!currentUser.data || typeof(currentUser.data)==='string'){
            return res.status(401).json({
                apiCode : -1,
                apiMessage : "No se pudo obtener la sesión"
            })
        }

        if( currentUser.statusCode === -1){
            const apiResponse : ApiResponse = {
                apiCode: -1,
                apiMessage: currentUser.statusMessage
            }
            return res.status(500).json(apiResponse);
        }

        const apiResponse : ApiResponse = {
            apiCode: 1,
            apiMessage: 'Consulta exitosa',
            data: currentUser.data
        }
        return res.status(200).json(apiResponse);
    } catch (error) {
      
        const apiResponse : ApiResponse = {
            apiCode: 1,
            apiMessage: 'Error interno de servidor'
        }
        return res.status(500).json(apiResponse);  
    }
}