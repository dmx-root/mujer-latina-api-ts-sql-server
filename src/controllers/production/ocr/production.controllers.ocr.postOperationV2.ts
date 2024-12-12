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
    op:string,
    color:string,
    talla:string,
    inicio:string,
    finalizacion:string,
    operarioId:string,
    modulo:number,
    anormalidad: string,
    horario: number,
    unidades:number
}

export const insertOperationV2: ( req:Request,res:Response ) => Promise<any> = async ( req:Request,res:Response ) => {

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
            op:yup.string().required().max(500).min(5),
            color:yup.string().required().max(5).min(3),
            talla:yup.string().required().max(10).min(1),
            inicio:yup.string().required().max(20).min(5),
            finalizacion:yup.string().required().max(20).min(5),
            operarioId:yup.string().required().max(20).min(5),
            modulo:yup.number().required().max(30).min(0),
            anormalidad: yup.string().max(2).min(2).nullable(),
            horario: yup.number().required().min(0).max(12),
            unidades:yup.number().required().min(1)
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
                        name: 'id_op',
                        type: sql.VarChar,
                        value: element.op
                    },
                    {
                        name: 'id_color',
                        type: sql.VarChar,
                        value: element.color
                    },
                    {
                        name: 'talla',
                        type: sql.VarChar,
                        value: element.talla
                    },                
                    {
                        name: 'ingresado_por',
                        type: sql.VarChar,
                        value: element.operarioId
                    },
                    {
                        name: 'inicio_operacion',
                        type: sql.VarChar,
                        value: element.inicio
                    },
                    {
                        name: 'fin_operacion',
                        type: sql.VarChar,
                        value: element.finalizacion
                    },
                    {
                        name: 'id_modulo',
                        type: sql.Int,
                        value: element.modulo
                    },
                    {
                        name: 'cantidad',
                        type: sql.Int,
                        value: element.unidades
                    },
                    {
                        name: 'id_anormalidad',
                        type: sql.VarChar,
                        value: element.anormalidad
                    },
                    {
                        name: 'id_categoria',
                        type: sql.Int,
                        value: 1
                    },               
                    {
                        name: 'id_horario_produccion',
                        type: sql.Int,
                        value: element.horario
                    }               
                ]
            
                const response : DbResponse = await db.execute('sp_gestion_ml_db_produccion_insercion_ocr_v2',params);            
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