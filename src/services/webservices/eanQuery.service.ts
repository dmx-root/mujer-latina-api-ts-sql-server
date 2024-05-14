import axios                                    from 'axios';
import { AxiosResponse, AxiosRequestConfig }    from 'axios';
import { eanConfig }                            from './config.service';
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

export async function getEanWebService( reference : string, colorId : string, tallaId :string ):Promise< ResponseInterface >{

    try {

        var config:AxiosRequestConfig = {
          method: 'post',
          url: 'http://autogestion.feriadelbrasier.com.co/WSUNOEE/WSUNOEE.asmx',
          headers: { 
            'Content-Type': 'text/xml;charset=UTF-8', 
            'SOAPAction': 'http://tempuri.org/EjecutarConsultaXML'
          },
          data : eanConfig(reference,colorId,tallaId)
        };
    
        const barcodeList:AxiosResponse=await axios(config);
        
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
