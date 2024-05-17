import sql                      from 'mssql';
import { Request, Response }    from "express";
import { dbParameters }         from "../../../interfaces/db/dbInterface";
import { Conexion }             from '../../../db/conection';
import { HttpErrorResponse }    from "../../../utilities/httpErrorResponse";

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
    dataLength?: number,
    date: string,
    data?:any,
}

export const getMenu : (req:Request,res:Response) => Promise<any> = async(req:Request,res:Response) => {

    const { id } = req.params;

    const params:Array<dbParameters> =[
        {
            name:'id_perfil',
            type:sql.Int,
            value:id
        },
        {
            name:'id_entorno',
            type:sql.Int,
            value:2
        },
    ];
    try {
        const db = new Conexion();

        const response: DbResponse = await db.execute('sp_gestion_ml_db_sesion_solicitud_menu_lista',params);

        if(response.statusCode===0){
            const apiResponse: ApiResponse= {
                apiCode: 0,
                date: new Date().toLocaleDateString(),
                apiMessage: 'No se encontraron elementos',
            }

            return res.status(200).json(apiResponse);
        }

        if(response.statusCode===-1){
            const apiResponse: ApiResponse= {
                apiCode: 0,
                date: new Date().toLocaleDateString(),
                apiMessage: response.message || 'No se obtuvo mensajes',
            }

            return res.status(500).json(apiResponse);
        }

        const apiResponse: ApiResponse = {
            apiCode: 1,
            date: new Date().toLocaleDateString(),
            dataLength: response.data?.length,
            apiMessage: 'Consulta exitosa',
            data:response.data
        }

        return res.status(200).json(apiResponse);
        
    } catch (error) {
              
        const apiResponse : ApiResponse = {
            apiCode: 1,
            date: new Date().toLocaleDateString(),
            apiMessage: 'Error interno de servidor'
        }
        return res.status(500).json(apiResponse); 
    }
}