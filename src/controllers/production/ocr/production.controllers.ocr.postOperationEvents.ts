import {Request, Response } from 'express';
import sql                  from 'mssql';
import * as yup             from 'yup';
import { Conexion }         from '../../../db/conection';
import { dbParameters }     from '../../../interfaces/db/dbInterface';
import { HttpErrorResponse }from '../../../utilities/httpErrorResponse';
import { Queue }            from '../../../queue/queue.main.insersion';

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

interface BodyInterface {
    ocrId:number
    cantidadModificada:number,
    descripcion: string,
    operarioId:string,
}

export const insersionOperationEvents: ( req:Request,res:Response ) => Promise<any> = async ( req:Request,res:Response ) => {

    const obj = req.body;

    try {
        if(!obj.elements || typeof(obj.elements)!=='object'){
            const apiResponse : ApiResponse = {
                apiCode:-1,
                apiMessage: 'No se obtuvo los campos necesarios'
            }
            return res.status(500).json(apiResponse);
        }
        const  elements : BodyInterface[] = req.body.elements;
        
        const schema = yup.object().shape({
            ocrId:              yup.number().required("El campo 'ocrId' no fue proporcionado en alguno de los elementos"),
            descripcion:        yup.string().required("El campo 'descripcion' no fue proporcionado en alguno de los elementos").max(50).min(5),
            operarioId:         yup.string().required("El campo 'operarioId' no fue proporcionado en alguno de los elementos").max(20).min(5),
            cantidadModificada: yup.number().required("El campo 'cantidadModificada' no fue proporcionado en alguno de los elementos")
    
        });
    
        const queve=new Queue();
            
        async function runQueue(){ 
            try {
                while ( !queve.isEmpty() ) {
                    const fn = queve.dequeve();
                    if (fn !== undefined)
                    await fn();
                }  
                const apiResponse : ApiResponse = {
                    apiCode:1,
                    apiMessage: 'Consulta exitosa'
                }
                return res.status(200).json(apiResponse);
          
            } catch (error) {
                const errors:any=error
                if(errors.errors){
                    const apiResponse: ApiResponse = {
                        apiCode:-1,
                        apiMessage:  errors.errors[0]
                    }
                    return res.status(500).json(apiResponse);
                }
                const apiResponse: ApiResponse = {
                    apiCode:-1,
                    apiMessage:  "Error interno de servidor" 
                }
                return res.status(500).json(apiResponse);
            }
        }
        
        elements.forEach((element, index)=> {
            // console.log(element)
            const insertInformation : (message : string) => Promise< Response | void > = async (message : string)=>{
                console.log(message)
                await schema.validate(element);
            }; 
    
            function waitingPromise(message : string) : () => Promise< Response | void >{
                return ()=>{
                    return insertInformation(message);
                }
            };
    
            queve.enqueve(waitingPromise(`Ejecuted async function, schema validator ${index+1}...`));
        })

        const db = new Conexion();
    
        elements.forEach((element, index)=> {
            // console.log(element)

            const insertInformation : (message : string) => Promise< Response | void > = async (message : string)=>{
    
                const params : dbParameters[] = [
                    {
                        name: 'id_ocr',
                        type: sql.Int,
                        value: element.ocrId
                    },
                    {
                        name: 'cantidad_modificada',
                        type: sql.Int,
                        value: element.cantidadModificada
                    },
                    {
                        name: 'descripcion',
                        type: sql.VarChar,
                        value: element.descripcion
                    },
                   
                    {
                        name: 'modificado_por',
                        type: sql.VarChar,
                        value: element.operarioId
                    }             
                ]
            
                const response : DbResponse = await db.execute('sp_gestion_ml_db_produccion_insersion_ocr_evento',params);            
                console.log(message)
                // console.log(response)

                if(response.statusCode!==1){
                    const apiResponse : ApiResponse = {
                        apiCode:0,
                        apiMessage: response.message || 'No se obtuvieron mensajes'
                    }
                    return res.status(400).json(apiResponse)
                }
        
            }; 
    
            function waitingPromise(message : string) : () => Promise< Response | void >{
                return ()=>{
                    return insertInformation(message);
                }
            };
    
            queve.enqueve(waitingPromise(`Ejecuted async function, insertion data ${index+1}...`));
        })
    
        runQueue();      
    } catch (error) {
        console.log(error)
        const apiResponse : ApiResponse = {
            apiCode : -1,
            apiMessage: 'Error interno de servidor'
        }

        return res.status(500).json(apiResponse);  
    }
}