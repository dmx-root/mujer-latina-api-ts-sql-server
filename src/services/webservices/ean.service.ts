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

interface barcodeResponseWS {
    [key : string]: string[] 
}

interface BarcodeInterface {
    ean:string,
    referencia:string,
    colorId:string,
    colorLabel:string,
    talla:string
}
interface ConnectionWSInterface {
    execute: () =>Promise<ResponseInterface>
}

export class Connection implements ConnectionWSInterface{
    private connectionString:AxiosRequestConfig;
    constructor({reference,colorId,tallaId}:{reference? : string, colorId? : string, tallaId? :string }){
        
        const data =`<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:tem="http://tempuri.org/">\n   
        <soap:Header/>\n   
        <soap:Body>\n      
        <tem:EjecutarConsultaXML>\n         
        <!--Optional:-->\n         
        <tem:pvstrxmlParametros>\n        
        <![CDATA[\n<Consulta>\n        
            <NombreConexion>Real</NombreConexion>\n        
            <IdCia>${process.env.ID_CIA_WS}</IdCia>\n        
            <IdProveedor>${process.env.ID_PROVEDOR_WS}</IdProveedor>\n        
            <IdConsulta>ML_AppML_2_Items_Barras</IdConsulta>\n        
            <Usuario>${process.env.USUARIO_WS}</Usuario>\n        
            <Clave>${process.env.CLAVE_WS}</Clave>\n        
            <Parametros>\n        
            <referencia>${reference||-1}</referencia>\n        
            <extension1>${colorId||-1}</extension1>\n        
            <extension2>${tallaId||-1}</extension2>\n        
            </Parametros>\n
            </Consulta>\n         
        ]]>\n         
        </tem:pvstrxmlParametros>\n      
        </tem:EjecutarConsultaXML>\n   
        </soap:Body>\n
        </soap:Envelope>`;

        this.connectionString= {
            method: 'post',
            url: 'http://autogestion.feriadelbrasier.com.co/WSUNOEE/WSUNOEE.asmx',
            headers: { 
              'Content-Type': 'text/xml;charset=UTF-8', 
              'SOAPAction': 'http://tempuri.org/EjecutarConsultaXML'
            },
            data 
        };
    }

    async execute(){
        try {
            const barcodeList:AxiosResponse=await axios(this.connectionString);
        
            let barcode : BarcodeInterface[] = []
    
            parseString(barcodeList.data, function (err, result) {
    
                const ean: barcodeResponseWS[] =result['soap:Envelope']['soap:Body'][0]['EjecutarConsultaXMLResponse'][0]['EjecutarConsultaXMLResult'][0]['diffgr:diffgram'][0]['NewDataSet'][0]['Resultado'];
    
                ean.forEach(element=>{
    
                    const detEan : BarcodeInterface = {
                        ean:element.Barras[0].trim(),
                        referencia:element.Referencia[0].trim(),
                        colorId:element.EXT1[0].trim(),
                        colorLabel:element.DESCRIPCION_EXT1[0].trim(),
                        talla:element.EXT2[0].trim()
                    };
    
                    barcode.push(detEan);
    
                });
    
            });
    
            const response : ResponseInterface = {
                statusCode : 1,
                statusMessage : 'Consulta exitosa',
                data: barcode
            };
    
            return response;
        } catch (error) {
            
        const response : ResponseInterface = {
            statusCode : -1,
            statusMessage : 'No se encontró el codigo de barras solicitado o no ha sido asignado'
        }

        return response;
        }
    }
}