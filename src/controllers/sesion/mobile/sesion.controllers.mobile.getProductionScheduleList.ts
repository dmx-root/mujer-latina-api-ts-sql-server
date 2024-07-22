import sql                      from 'mssql';
import { Request, Response }    from "express";
import { dbParameters }         from "../../../interfaces/db/dbInterface";
import { Conexion }             from '../../../db/conection';
import { HttpErrorResponse }    from '../../../utilities/httpErrorResponse';

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

export const getProductionScheduleList : (req:Request, res:Response) => Promise <Response> = async (req:Request,res:Response) => {

    try {
        const db = new Conexion();

        const response : DbResponse = await db.execute('sp_gestion_ml_db_sesion_solicitud_horarios_produccion_lista');

        if(response.statusCode===0){
            const apiResponse: ApiResponse= {
                apiCode: 0,
                apiMessage: response.message || "No se obtuvo mensajes",
            }

            return res.status(404).json(apiResponse);
        }
        if(response.statusCode === -1){
            const apiResponse: ApiResponse= {
                apiCode: -1,
                apiMessage: response.message || "No se obtuvo mensajes",
            }

            return res.status(500).json(apiResponse);
        }

        const apiResponse: ApiResponse = {
            apiCode: 1,
            apiMessage: 'Consulta exitosa',
            data:response.data
        }

        return res.status(200).json(apiResponse);
        
    } catch (error) {
        const apiResponse: ApiResponse= {
            apiCode: -1,
            apiMessage: "Error interno de servidor",
        }

        return res.status(500).json(apiResponse);
    }
}