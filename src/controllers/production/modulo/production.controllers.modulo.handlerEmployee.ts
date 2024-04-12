import { Request, Response }    from 'express';
import sql                      from 'mssql';
import { Conexion }             from '../../../db/conection';
import { dbParameters }     from '../../../interfaces/db/dbInterface';
import { HttpErrorResponse }    from '../../../utilities/httpErrorResponse';
import * as yup from 'yup'


interface DbResponse {

    statusCode: 1 | 0 | -1,
    message?: string,
    data?: any
    information?: string,
    err?: HttpErrorResponse,

}

interface ApiResponse {
    apiCode: -1 | 0 | 1,
    apiMessage: string,
    data?:any
}

export const handlerEmployee : (req:Request,res:Response) => Promise<any> = async (req:Request,res:Response) => {
        
    try {
        const { employee,modulo,user } = req.query;

        const params : dbParameters[] =[
            {
                name:'codigo_operario',
                type:sql.VarChar,
                value:employee
            },
            {
                name:'id_modulo',
                type:sql.Int,
                value:modulo
            },
            {
                name:'ingresado_por',
                type:sql.VarChar,
                value:user
            },
        ];

        const schema = yup.object().shape({
            employee: yup.string().required().max(10).min(2),
            modulo: yup.number().required(),
            user: yup.string().required().max(20).min(5)
        })

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

        const db = new Conexion(); 

        const response : DbResponse = await db.execute('sp_gestion_ml_db_produccion_asignacion_operario',params);
        
        if(response.statusCode === -1){
            const apiResponse: ApiResponse ={
                apiCode:0,
                apiMessage:response.message || "No se obtuvo mensajes"
            }
            return res.status(500).json(apiResponse)
        }

        if(response.statusCode === 0){
            const apiResponse: ApiResponse ={
                apiCode:0,
                apiMessage:response.message || "No se obtuvo mensajes"
            }
            return res.status(404).json(apiResponse)
        }

        const apiResponse: ApiResponse = {
            apiCode:1,
            apiMessage: 'Consulta exitosa'
        }
        return res.status(200).json(apiResponse);
        
    } catch (error) {
        const apiResponse: ApiResponse = {
            apiCode:-1,
            apiMessage:'Error interno en el servidor'
        }
        return res.status(500).json(apiResponse)
    }
}
