// export async function getEnableBarCode(reference:string):Promise<StatuServiceBarCodeResponse>{

//     var data = `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:tem="http://tempuri.org/">\n   
//     <soap:Header/>\n   
//     <soap:Body>\n      
//     <tem:EjecutarConsultaXML>\n         
//     <!--Optional:-->\n         
//     <tem:pvstrxmlParametros>\n        
//     <![CDATA[\n<Consulta>\n        
//         <NombreConexion>Real</NombreConexion>\n        
//         <IdCia>${process.env.ID_CIA_WS}</IdCia>\n        
//         <IdProveedor>${process.env.ID_PROVEDOR_WS}</IdProveedor>\n        
//         <IdConsulta>ML_AppML_2_Items_Barras</IdConsulta>\n        
//         <Usuario>${process.env.USUARIO_WS}</Usuario>\n        
//         <Clave>${process.env.CLAVE_WS}</Clave>\n        
//         <Parametros>\n        
//         <referencia>${reference}</referencia>\n        
//         <extension1>-1</extension1>\n        
//         <extension2>-1</extension2>\n        
//         </Parametros>\n
//         </Consulta>\n         
//     ]]>\n         
//     </tem:pvstrxmlParametros>\n      
//     </tem:EjecutarConsultaXML>\n   
//     </soap:Body>\n
//     </soap:Envelope>`;

//     try {

//         const statusServiceResponse:StatuServiceBarCodeResponse={
//             serviceData:[],
//             serviceStatusCode:1,
//             serviceStatusMessage:'Consulta exitosa'
//         };
    
//         var config:AxiosRequestConfig = {
//           method: 'post',
//           url: 'http://autogestion.feriadelbrasier.com.co/WSUNOEE/WSUNOEE.asmx',
//           headers: { 
//             'Content-Type': 'text/xml;charset=UTF-8', 
//             'SOAPAction': 'http://tempuri.org/EjecutarConsultaXML'
//           },
//           data : data
//         };
    
//         var res:Array<barCode>=[]

//         const response:AxiosResponse=await axios(config);

//         parseString(response.data, function (err, result) {

//             const ean:Array<barCodeResponseWS>=result['soap:Envelope']['soap:Body'][0]['EjecutarConsultaXMLResponse'][0]['EjecutarConsultaXMLResult'][0]['diffgr:diffgram'][0]['NewDataSet'][0]['Resultado'];

//             ean.forEach(element=>{

//                 const detEan:barCode={
//                     ean:element.Barras[0].trim(),
//                     referencia:element.Referencia[0].trim(),
//                     colorId:element.EXT1[0].trim(),
//                     colorLabel:element.DESCRIPCION_EXT1[0].trim(),
//                     talla:element.EXT2[0].trim()
//                 };

//                 res.push(detEan);

//             });

//             statusServiceResponse.serviceData=res;

//         });

//         return statusServiceResponse;

//     } catch (error) {

//         const statusServiceResponse:StatuServiceBarCodeResponse={
//             serviceData:[],
//             serviceStatusCode:0,
//             serviceStatusMessage:'El codigo de barras que busca no está asociado a los recursos de la compañia'
//         };

//         return statusServiceResponse;
//     }
// }