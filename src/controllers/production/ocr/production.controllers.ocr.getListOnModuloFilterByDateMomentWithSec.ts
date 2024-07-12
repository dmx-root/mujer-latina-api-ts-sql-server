import * as yup                 from 'yup'
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

export const getListOnModuloFilterByDateMomentWithSec: (req: Request, res: Response) => Promise<any> = async (req: Request, res: Response) => {

    const { page, pageSize, filtro, moduloId } = req.query;

    const schema = yup.object().shape({
        page: yup.number().max(50).min(1),
        pageSize: yup.number().max(50).min(1),
        filtro: yup.string().required().max(20).min(3),
        moduloId: yup.number().required()
    });

    const params: Array<dbParameters> = [
        {
            name: 'offset',
            type: sql.Int,
            value: page && pageSize ? (parseInt(page.toString()) - 1) * parseInt(pageSize.toString()) : 0
        },
        {
            name: 'cantidad',
            type: sql.Int,
            value: page && pageSize ? pageSize : 20
        },

        {
            name: 'filtro',
            type: sql.VarChar,
            value: filtro
        },
        {
            name: 'id_mdl',
            type: sql.Int,
            value: moduloId
        }

    ]

    try {

        await schema.validate(req.query)

    } catch (error) {
        const errors: any = error
        const apiResponse: ApiResponse = {
            apiCode: -1,
            apiMessage: errors.errors[0]
        }
        return res.status(500).json(apiResponse);
    }

    try {
        const db = new Conexion();
        const response: DbResponse = await db.execute('sp_gestion_ml_db_reportes_solicitud_ocr_lista_filtrada_modulo_segundas', params);

        if (response.statusCode === 0) {
            const apiResponse: ApiResponse = {
                apiCode: 0,
                date: new Date().toDateString(),
                apiMessage: response.message || "No se obtuvo mensajes"
            }
            return res.status(404).json(apiResponse)
        }

        const apiResponse: ApiResponse = {
            apiCode: 1,
            apiMessage: 'Consulta exitosa',
            dataLength: response.data?.length,
            date: new Date().toDateString(),
            data: response.data,
        }
        return res.status(200).json(apiResponse);

    } catch (error) {
        const apiResponse: ApiResponse = {
            apiCode: -1,
            date: new Date().toDateString(),
            apiMessage: 'Error interno en el servidor'
        }
        return res.status(500).json(apiResponse)
    }

}
