import axios,{ AxiosRequestConfig }     from 'axios'
import { parseString}                   from 'xml2js';
import { userConfig }                   from './config.service';

interface ResponseInterface {
    statusCode: 1 | 0 | -1,
    statusMessage: string,
    data?:any,
    error?:Error | null
}

export const getUserWebService: (document:string) => Promise<ResponseInterface> = async (document:string) => {

    const axiosConfig:AxiosRequestConfig={
        method:'post',
        url:process.env.URL_WS,
        headers:{
            "Content-Type":'text/xml;charset=UTF-8',
            'SOAPAction': 'http://tempuri.org/EjecutarConsultaXML'
        },
        data:userConfig(document)
    };

    let response: ResponseInterface= {
        statusCode:0,
        statusMessage:'',
        error:null
    }

    try {
        const dataResponse = await axios(axiosConfig);

        parseString(dataResponse.data, function (err, result) {
            
            if(err){ 
                console.log(err)
                response.statusMessage='Error en la conversión';
                response.statusCode=-1,
                response.error = err
                return null;
            }
            
            const user=result['soap:Envelope']['soap:Body'][0]['EjecutarConsultaXMLResponse'][0]['EjecutarConsultaXMLResult'][0]['diffgr:diffgram'][0]['NewDataSet'][0]['Resultado'];
            const newUser={
                typeId:user[0].TIPO_ID[0],
                documetId:user[0].CC[0],
                userName:user[0].NOMBRE[0],
                description:user[0].Descripcion[0]
            } 
    
            response.data= newUser,
            response.statusCode = 1;
            response.statusMessage = 'Consulta exitosa';
        });
        return response;
        
    } catch (error) { 
        response.statusMessage='Error en la consulta del usuario';
        response.statusCode=-1,
        response.error = Error('Falló la consulta, no se pudo obtener los datos del usuario')
        return response;
    }

}
