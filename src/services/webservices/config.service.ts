import dotenv from 'dotenv';

dotenv.config()

export const userConfig : (document : string) => string = (document : string) => {
    return `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:tem="http://tempuri.org/">\n   
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
            <cedula>${document}</cedula>\n    
        </Parametros>\n</Consulta>\n         ]]>\n         
        </tem:pvstrxmlParametros>\n      </tem:EjecutarConsultaXML>\n   
    </soap:Body>\n</soap:Envelope>`;
}

export const opConfig : (op : string) => string = (op : string) => {
    return `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:tem="http://tempuri.org/">\n   
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
}

export const eanConfig : ( reference : string, colorId : string, tallaId :string ) => string = ( reference : string, colorId : string, tallaId :string ) => {
    return `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:tem="http://tempuri.org/">\n   
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
        <referencia>${reference}</referencia>\n        
        <extension1>${colorId}</extension1>\n        
        <extension2>${tallaId}</extension2>\n        
        </Parametros>\n
        </Consulta>\n         
    ]]>\n         
    </tem:pvstrxmlParametros>\n      
    </tem:EjecutarConsultaXML>\n   
    </soap:Body>\n
    </soap:Envelope>`;
}
