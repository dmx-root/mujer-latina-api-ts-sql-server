import { Conexion }             from '../../../db/conection';
import { dbParameters }         from '../../../interfaces/db/dbInterface';
import { HttpErrorResponse }    from '../../../utilities/httpErrorResponse';
import { Request, Response }    from 'express';
import sql                      from 'mssql';
import * as yup                 from 'yup';

interface DbResponse {
    statusCode: 1 | 0 | -1,
    message?: string,
    data?: any,
    information?: string,
    err?: HttpErrorResponse
}

interface ApiResponse {
    apiCode: -1 | 0 | 1,
    apiMessage: string,
    data?:any
}

export const getListFilterByType : ( req:Request, res:Response ) => Promise<any> = async (req:Request,res:Response) => {
    const { type, user } = req.query;

    const schema = yup.object().shape({
        type:yup.string().required().max(3).min(2),
        user:yup.string().max(20).min(5),
    });

    const params : Array<dbParameters> = [
        {
            name:'tipo_op',
            type:sql.VarChar,
            value:type
        },
        {
            name: 'id_usuario',
            type: sql.VarChar,
            value: user || null
        }  
    ]

    try {
        
        await schema.validate(req.query)

    } catch (error) {
        const errors:any=error
        const apiResponse: ApiResponse = {
            apiCode:-1,
            apiMessage: errors.errors[0] 
        }
        return res.status(500).json(apiResponse);
    }

    try {
        const db = new Conexion();

        const response : DbResponse = await db.execute('sp_gestion_ml_db_produccion_solicitud_op_lista_filtrada_tipo',params);

        if(response.statusCode === -1){
            const apiResponse: ApiResponse= {
                apiCode: -1,
                apiMessage: response.message ||'No se obtuvo mensajes',
            }

            return res.status(500).json(apiResponse);
        }

        if(response.statusCode === 0){
            const apiResponse: ApiResponse= {
                apiCode: 0,
                apiMessage: response.message ||'No se obtuvo mensajes',
            }

            return res.status(404).json(apiResponse);
        }

        const apiResponse: ApiResponse = {
            apiCode: 1,
            apiMessage: 'Consulta exitosa',
            data:response.data
        }

        return res.status(200).json(apiResponse);
        
    } catch (error) {
        console.log(error);
        const apiResponse: ApiResponse= {
            apiCode: -1,
            apiMessage: "Error interno del servidor",
        }

        return res.status(500).json(apiResponse);
    }
}
