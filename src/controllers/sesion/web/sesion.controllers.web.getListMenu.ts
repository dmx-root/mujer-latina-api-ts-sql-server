import sql                      from 'mssql';
import { Request, Response }    from "express";
import { dbParameters }         from "../../../interfaces/db/dbInterface";
import { Conexion }             from '../../../db/conection';
import { ApiResponse }          from '../../../interfaces/api/response';

interface ApiDataResponse extends ApiResponse {
    data:Array<any>
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

        const response:Array<any> = await db.execute('sp_gestion_ml_db_sesion_solicitud_menu_lista',params);

        if(response.length===0){
            const apiResponse: ApiResponse= {
                statusCode: 0,
                message: 'No se encontraron elementos',
            }

            return res.status(200).json(apiResponse);
        }

        const apiResponse: ApiDataResponse = {
            statusCode: 1,
            message: 'Consulta exitosa',
            data:response
        }

        return res.status(200).json(apiResponse);
        
    } catch (error) {
        console.log(error)
    }
}