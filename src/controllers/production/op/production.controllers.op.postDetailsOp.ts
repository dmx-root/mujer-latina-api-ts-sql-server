import { Request, Response }    from 'express';
import sql                      from 'mssql';
import { Conexion }             from '../../../db/conection';
import { dbParameters }         from '../../../interfaces/db/dbInterface';
import { HttpErrorResponse }    from '../../../utilities/httpErrorResponse';
import { getOpWebService }      from '../../../services/webservices/opQuery.service';
import { getEanWebService }     from '../../../services/webservices/eanQuery.service';
import { Queue }                from '../../../queue/queue.main.insersion';
import * as yup                 from 'yup';


interface ApiDataResponse extends ApiResponse {
    data:Array<any>
} 

interface DbResponse {

    statusCode: 1 | 0 | -1,
    message?: string,
    data?: any
    information?: string,
    err?: HttpErrorResponse

}

interface DetailInterface {
    op : string,
    referencia : string,
    colorId : string,
    colorLabel : string,
    talla : string,
    planeada : number,
    completada : number,
    pendiente : number
}

interface BarcodeInterface {
    ean:string,
    referencia:string,
    colorId:string,
    colorLabel:string,
    talla:string
}

interface DataInsertionInterface extends DetailInterface {
    ean:string,
    usuario:string
}
interface ApiResponse {
    apiCode: -1 | 0 | 1,
    apiMessage: string,
    data?:any
}


export const insertListDetailOp : (req : Request, res : Response)=> Promise<any> = async (req : Request, res : Response) => {

    const { op, usuario } = req.body;

    const schema = yup.object().shape({
        op:yup.string().max(10).min(3).required(""),
        usuario:yup.string().max(20).min(5)
    });

    try {
        
        await schema.validate(req.body)

    } catch (error) {
        const errors:any=error
        const apiResponse: ApiResponse = {
            apiCode:-1,
            apiMessage: errors.errors[0] 
        }
        return res.status(500).json(apiResponse);
    }

    console.log(req.body);
    // console.log(req.headers);
    try {
        const params : dbParameters[] = [
            {
                name:'id_op',
                type: sql.VarChar,
                value: op
            }
        ];

        const db = new Conexion();

        const response : DbResponse = await db.execute('sp_gestion_ml_db_produccion_solicitud_op_lista_detalles',params);
        if(response.statusCode===1){
            const apiResponse : ApiDataResponse = {
                apiCode: 1,
                apiMessage: 'Consulta exitosa',
                data: response.data
            }
            return res.status(200).json(apiResponse);
        }
        
        if(response.statusCode===-1){
            const apiResponse : ApiResponse = {
                apiCode: -1,
                apiMessage: response.message||'No se obtuvo mensajes'
            }
            return res.status(500).json(apiResponse);
        }
        
        const ws = await getOpWebService(op);
        
        if(ws.statusCode === 0){
            const apiResponse : ApiResponse = {
                apiCode: 0,
                apiMessage: ws.statusMessage
            }
            return res.status(404).json(apiResponse);
        }
        
        const details : DetailInterface[] = ws.data; 
        
        const ean = await getEanWebService(details[0].referencia,'-1','-1');
        
        if(ean.statusCode===0){
            const apiResponse : ApiResponse = {
                apiCode: 0,
                apiMessage: ean.statusMessage
            }
            return res.status(404).json(apiResponse);
        }

        const eanList : BarcodeInterface[] = ean.data;
        
        let dataInsertionList : DataInsertionInterface[] = []
        
        details.forEach((element) => {
            const filterEan = eanList.filter((value)=>value.colorId===element.colorId && value.talla === element.talla) 
            
            if(filterEan.length !== 0){
                const dataInsertionElement : DataInsertionInterface = {
                    referencia:     element.referencia,
                    op:             element.op,
                    colorId:        element.colorId,
                    talla:          element.talla,
                    colorLabel:     element.colorLabel,
                    completada:     element.completada,
                    pendiente:      element.pendiente,
                    planeada:       element.planeada,
                    ean:            filterEan[0].ean,
                    usuario:        usuario
                };
                dataInsertionList.push(dataInsertionElement)
            }
        });
        // console.log(operarioId)
        
        if(dataInsertionList.length!==details.length){
            const apiResponse : ApiResponse = {
                apiCode: 0,
                apiMessage: 'No se pudo obtener los códigos de barras solicitados'
            }
            return res.status(404).json(apiResponse);
        }

        // console.log(dataInsertionList)

        const queve=new Queue();
        
        async function runQueue(){ 
            try {
                while ( !queve.isEmpty() ) {
                    const fn = queve.dequeve();
                    if (fn !== undefined)
                    await fn();
                }  
            } catch (error) {
                console.log(error)
            }
        }

        dataInsertionList.forEach((element,index) => {
            const insertInformation : (message : string) => Promise< Response | void > = async (message : string)=>{
                const insertionParams : dbParameters[] = [
                    {
                        name:'id_op',
                        type: sql.VarChar,
                        value: element.op
                    },
                    {
                        name:'id_color',
                        type: sql.VarChar,
                        value: element.colorId
                    },
                    {
                        name:'referencia',
                        type: sql.VarChar,
                        value: element.referencia
                    },
                    {
                        name:'talla',
                        type: sql.VarChar,
                        value: element.talla
                    },
                    {
                        name:'ean',
                        type: sql.VarChar,
                        value: element.ean
                    },
                    {
                        name:'color_etiqueta',
                        type: sql.VarChar,
                        value: element.colorLabel
                    },
                    {
                        name:'candidad_planeada_detalle',
                        type: sql.Int,
                        value: element.planeada
                    },
                    {
                        name:'cantidad_ejecutada_detalle',
                        type: sql.Int,
                        value: element.completada
                    },
                    {
                        name:'ingresado_por',
                        type: sql.VarChar,
                        value: element.usuario
                    },
                ];

                const response : DbResponse = await db.execute('sp_gestion_ml_db_produccion_insercion_op',insertionParams);
                
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

            queve.enqueve(waitingPromise(`Ejecuted async function ${index+1}...`));

        });

        const getInformation : (message : string ) => Promise< Response > = async ( message : string ) =>{

            const response : DbResponse = await db.execute('sp_gestion_ml_db_produccion_solicitud_op_lista_detalles',params);
            console.log(message)

            if(response.statusCode!==1){
                const apiResponse : ApiResponse = {
                    apiCode:1,
                    apiMessage: response.message || 'No se obtuvieron mensajes'
                }
                return res.status(400).json(apiResponse)
            }

            const apiResponse : ApiDataResponse = {
                apiCode:1,
                apiMessage: response.message || 'No se obtuvieron mensajes',
                data: response.data
            }

            return res.status(200).json(apiResponse)
        }

        function waitingPromise(message : string) : () => Promise< Response >{
            return ()=>{
                return getInformation(message);
            }
        };

        queve.enqueve(waitingPromise(`Ejecuted async function...`))

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