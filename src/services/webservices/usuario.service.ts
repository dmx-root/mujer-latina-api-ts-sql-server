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


interface ConnectionWSInterface {
    execute: () =>Promise<ResponseInterface>
}

export class Connection implements ConnectionWSInterface{
    private connectionString:AxiosRequestConfig;
    constructor({document}:{document?:string }){
        
        const data =`<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:tem="http://tempuri.org/">\n   
        <soap:Header/>\n   
        <soap:Body>\n<tem:EjecutarConsultaXML>\n
            <!--Optional:-->\n         
            <tem:pvstrxmlParametros>\n         
            <![CDATA[\n<Consulta><NombreConexion>Real</NombreConexion>\n    
            <IdCia>${process.env.ID_CIA_WS}</IdCia>\n    
            <IdProveedor>${process.env.ID_PROVEDOR_WS}</IdProveedor>\n    
            <IdConsulta>${process.env.ID_CONSULTA}</IdConsulta>\n    
            <Usuario>${process.env.USUARIO_WS}</Usuario>\n    
            <Clave>${process.env.CLAVE_WS}</Clave>\n    
            <Parametros>\n      
                <cedula>${document||-1}</cedula>\n    
            </Parametros>\n</Consulta>\n         ]]>\n         
            </tem:pvstrxmlParametros>\n      
            </tem:EjecutarConsultaXML>\n   
        </soap:Body>\n</soap:Envelope>`;

        this.connectionString ={
            method:'post',
            url:process.env.URL_WS,
            headers:{
                "Content-Type":'text/xml;charset=UTF-8',
                'SOAPAction': 'http://tempuri.org/EjecutarConsultaXML'
            },
            data
        };
    }

    async execute(){
        let response: ResponseInterface= {
            statusCode:0,
            statusMessage:'',
            error:null
        }
    
        try {
            const dataResponse = await axios(this.connectionString);
    
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
}