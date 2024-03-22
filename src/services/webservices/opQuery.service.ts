import { opConfig } from './config.service';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { parseString } from 'xml2js'
import axios from 'axios';

interface ResponseInterface {
    statusCode: 1 | 0 | -1,
    statusMessage: string,
    data?: any,
    error?: Error | null
}

interface detOpResponseWS{
    [key : string]: string[] 
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

export const getOpWebService : (op : string)=> Promise< ResponseInterface > = async (op : string) => {

    try {
        var config : AxiosRequestConfig = {
            method: 'post',
            url:process.env.URL_WS,
            headers: { 
                'Content-Type': 'text/xml;charset=UTF-8', 
                'SOAPAction': 'http://tempuri.org/EjecutarConsultaXML'
            },
            data : opConfig(op)
        };

        const opList : AxiosResponse = await axios(config);

        let detail : DetailInterface[] = []

        parseString(opList.data, function (err, result) {

            const ops = result['soap:Envelope']['soap:Body'][0]['EjecutarConsultaXMLResponse'][0]['EjecutarConsultaXMLResult'][0]['diffgr:diffgram'][0]['NewDataSet'][0]['Resultado']; 
            
            ops.forEach((element:detOpResponseWS) => {

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