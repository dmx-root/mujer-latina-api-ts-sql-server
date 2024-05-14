import axios                                    from 'axios';
import { AxiosResponse, AxiosRequestConfig }    from 'axios';
import { parseString }                          from 'xml2js';
import dotenv from 'dotenv';

dotenv.config()

interface ResponseInterface {
    statusCode: 1 | 0 | -1,
    statusMessage: string,
    data?: any,
    error?: Error | null
}

interface detOpResponseWS{
    [key : string]: string[] 
}


interface ConnectionWSInterface {
    execute: () =>Promise<ResponseInterface>
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

export class Connection implements ConnectionWSInterface{
    private connectionString:AxiosRequestConfig;
    constructor({op}:{op :string }){
        
        const data =`<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:tem="http://tempuri.org/">\n   
        <soap:Header/>\n   
        <soap:Body>\n      
        <tem:EjecutarConsultaXML>\n         
        <!--Optional:-->\n         
        <tem:pvstrxmlParametros>\n         
        <![CDATA[\n<Consulta>
        <NombreConexion>Real</NombreConexion>\n    
        <IdCia>${process.env.ID_CIA_WS}</IdCia>\n    
        <IdProveedor>${process.env.ID_PROVEDOR_WS}</IdProveedor>\n    
        <IdConsulta>ML_AppWEBML_1_Asignacion_OP_Modulos</IdConsulta>\n    
        <Usuario>${process.env.USUARIO_WS}</Usuario>\n    
        <Clave>${process.env.CLAVE_WS}</Clave>\n 
            <Parametros>\n      
                <docto>${op}</docto>\n    
            </Parametros>\n</Consulta>\n         ]]>\n         
        </tem:pvstrxmlParametros>\n      
        </tem:EjecutarConsultaXML>\n   
        </soap:Body>\n</soap:Envelope>`;

        this.connectionString= {
            method: 'post',
            url:process.env.URL_WS,
            headers: { 
                'Content-Type': 'text/xml;charset=UTF-8', 
                'SOAPAction': 'http://tempuri.org/EjecutarConsultaXML'
            },
            data 
        };
    }

    async execute(){
        try {
            const opList : AxiosResponse = await axios(this.connectionString);
    
            let detail : DetailInterface[] = []
    
            parseString(opList.data, function (err, result) {
    
                const ops : detOpResponseWS[] = result['soap:Envelope']['soap:Body'][0]['EjecutarConsultaXMLResponse'][0]['EjecutarConsultaXMLResult'][0]['diffgr:diffgram'][0]['NewDataSet'][0]['Resultado']; 
                
                ops.forEach((element) => {
    
                    const detOp = {
                        op:element.OP[0].trim(),
                        referencia:element.Referencia[0].trim(),
                        colorId:element.Id_Color[0].trim(),
                        colorLabel:element.Color[0].trim(),
                        talla:element.Talla[0].trim(),
                        planeada:parseInt(element.Planeada[0].trim()),
                        completada:parseInt(element.Completada[0].trim()),
                        pendiente:parseInt(element.Pendiente[0].trim())
                    };
    
                    detail.push(detOp);
                });
            });
    
            const response : ResponseInterface = {
                statusCode : 1,
                statusMessage : 'Consulta Exitosa',
                data : detail
            }
    
            return response;
            
        } catch (error) {
            const response : ResponseInterface = {
                statusCode: 0,
                statusMessage : 'No se encontró la OP solicitada',
                error: new Error('ERROR DE CONTROLADOR AL TRATAR DE SOLICITAR LA OP')
            }
            return response;
        }
    }
}