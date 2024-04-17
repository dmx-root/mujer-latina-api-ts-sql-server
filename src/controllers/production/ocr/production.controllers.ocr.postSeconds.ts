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
    colorId:string,
    talla:string,
    operarioId:string,
    moduloId:number,
    unidades:number
}

export const insertSecods: ( req:Request,res:Response ) => Promise<any> = async ( req:Request,res:Response ) => {

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
            
            op:         yup.string().required("El campo 'op' no fue proporcionado en alguno de los elementos").max(500).min(5),
            colorId:    yup.string().required("El campo 'color' no fue proporcionado en alguno de los elementos").max(5).min(3),
            talla:      yup.string().required("El campo 'talla' no fue proporcionado en alguno de los elementos").max(10).min(1),
            operarioId: yup.string().required("El campo 'operarioId' no fue proporcionado en alguno de los elementos").max(20).min(5),
            moduloId:   yup.number().required("El campo 'moduloId' no fue proporcionado en alguno de los elementos"),
            unidades:   yup.number().required("El campo 'unidades' no fue proporcionado en alguno de los elementos")
    
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
                        value: element.colorId
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
                        value: null
                    },
                    {
                        name: 'fin_operacion',
                        type: sql.VarChar,
                        value: null
                    },
                    {
                        name: 'id_modulo',
                        type: sql.Int,
                        value: element.moduloId
                    },
                    {
                        name: 'cantidad',
                        type: sql.Int,
                        value: element.unidades
                    },
                    {
                        name: 'id_anormalidad',
                        type: sql.VarChar,
                        value: null
                    },
                    {
                        name: 'id_categoria',
                        type: sql.Int,
                        value: 2
                    }               
                ]
            
                const response : DbResponse = await db.execute('sp_gestion_ml_db_produccion_insercion_ocr',params);            
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