import { Request, Response }    from 'express';
import sql                      from 'mssql';
import { Conexion }             from '../../../db/conection';
import { ApiResponse }          from '../../../interfaces/api/response';
import { dbParameters }         from '../../../interfaces/db/dbInterface';
import { HttpErrorResponse }    from '../../../utilities/httpErrorResponse';
import { getOpWebService }      from '../../../services/webservices/opQuery.service';
import { getEanWebService }     from '../../../services/webservices/eanQuery.service';
import { Queue }                from '../../../queue/queue.main.insersion';

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

export const insertListDetailOp : (req : Request, res : Response)=> Promise<any> = async (req : Request, res : Response) => {

    const { op, usuario } = req.body;
    // console.log(op)
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
                statusCode: 1,
                message: 'Consulta exitosa',
                data: response.data
            }
            return res.status(200).json(apiResponse);
        }

        if(response.statusCode===-1){
            const apiResponse : ApiResponse = {
                statusCode: -1,
                message: response.message||'No se obtuvo mensajes'
            }
            return res.status(500).json(apiResponse);
        }
        
        const ws = await getOpWebService(op);

        if(ws.statusCode === 0){
            const apiResponse : ApiResponse = {
                statusCode: 0,
                message: ws.statusMessage
            }
            return res.status(404).json(apiResponse);
        }
        
        const details : DetailInterface[] = ws.data; 
        
        const ean = await getEanWebService(details[0].referencia,'-1','-1');
        
        if(ean.statusCode===0){
            const apiResponse : ApiResponse = {
                statusCode: 0,
                message: ean.statusMessage
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

        if(dataInsertionList.length!==details.length){
            const apiResponse : ApiResponse = {
                statusCode: 0,
                message: 'No se pudo obtener los códigos de barras solicitados'
            }
            return res.status(404).json(apiResponse);
        }

        console.log(dataInsertionList)

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
                        statusCode:0,
                        message: response.message || 'No se obtuvieron mensajes'
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
                    statusCode:1,
                    message: response.message || 'No se obtuvieron mensajes'
                }
                return res.status(400).json(apiResponse)
            }

            const apiResponse : ApiDataResponse = {
                statusCode:1,
                message: response.message || 'No se obtuvieron mensajes',
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
            statusCode : -1,
            message: 'Error interno de servidor'
        }

        return res.status(500).json(apiResponse);
    }
}