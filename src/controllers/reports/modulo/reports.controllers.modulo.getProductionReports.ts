import {Request, Response }     from 'express';
import sql                      from 'mssql';
import { Conexion }             from '../../../db/conection';
import { HttpErrorResponse }    from '../../../utilities/httpErrorResponse';
import { dbParameters }         from '../../../interfaces/db/dbInterface';

interface DbResponse {
    statusCode: 1 | 0 | -1,
    message?: string,
    data?: any
    information?: string,
    err?: HttpErrorResponse
}

interface ApiResponse {
    apiCode: -1 | 0 | 1,
    apiMessage: string,
    data?: any,
    dataLength?: number;
    date?: string
}

export const getProductionReports: (req: Request, res: Response) => Promise<any> = async (req: Request, res: Response) => {

    const { id} = req.params;

    const params: Array<dbParameters> = [
        {
            name: 'id_mdl',
            type: sql.Int,
            value: id
        },

    ]

    try {
        const db = new Conexion();
        const eventsReports: DbResponse = await db.execute('sp_gestion_ml_db_reportes_solicitud_modulo_produccion_eventos', params);
        const generalReports: DbResponse = await db.execute('sp_gestion_ml_db_reportes_solicitud_modulo_produccion_general', params);
        const secondsReports: DbResponse = await db.execute('sp_gestion_ml_db_reportes_solicitud_modulo_produccion_segundas', params);

        if (generalReports.statusCode === 0) {
            const apiResponse: ApiResponse = {
                apiCode: 0,
                apiMessage: generalReports.message || "No se obtuvo mensajes"
            }
            return res.status(404).json(apiResponse)
        }
        if (eventsReports.statusCode === 0) {
            const apiResponse: ApiResponse = {
                apiCode: 0,
                apiMessage: eventsReports.message || "No se obtuvo mensajes"
            }
            return res.status(404).json(apiResponse)
        }
        if (secondsReports.statusCode === 0) {
            const apiResponse: ApiResponse = {
                apiCode: 0,
                apiMessage: secondsReports.message || "No se obtuvo mensajes"
            }
            return res.status(404).json(apiResponse)
        }

        const apiResponse: ApiResponse = {
            apiCode:1,
            apiMessage: 'Consulta exitosa',
            date:new Date().toDateString(),
            data:[{
                eventsReports:eventsReports.data[0],
                generalReports:generalReports.data[0],
                secondsReports:secondsReports.data[0]
            }]
        }
        return res.status(200).json(apiResponse);

    } catch (error) {
        const apiResponse: ApiResponse = {
            apiCode: -1,
            apiMessage: 'Error interno en el servidor'
        }
        return res.status(500).json(apiResponse)
    }

}
