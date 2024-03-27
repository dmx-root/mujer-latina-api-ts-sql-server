import { dbParameters }         from '../interfaces/db/dbInterface';
import { HttpErrorResponse }    from '../utilities/httpErrorResponse';
import { dbConfig }             from './config';
import sql                      from 'mssql';

interface DbResponse {

    statusCode: 1 | 0 | -1,
    message?: string,
    data?: any
    information?: string,
    err?: HttpErrorResponse

}

export class Conexion {

    private config : sql.config;
    
    constructor(){
        this.config = dbConfig;
    };

    async execute(procedure : string, parameters : Array<dbParameters> = []) : Promise<any>{
        return new Promise(async (resolve : (cont : DbResponse) => void, reject : (cont : DbResponse) => void)=>{

            let pool! : sql.ConnectionPool
            try {

                pool = await new sql.ConnectionPool(this.config).connect();

            } catch (error) {
                console.log(error);
                const dbResponse : DbResponse = {
                    statusCode:-1,
                    information: 'ERROR AL EJECUTAR SP',
                    err: new HttpErrorResponse('NO SE PUDO CONECTAR A LA BASE DE DATOS',500)
                };
                reject( dbResponse )
                return;
            }

            try {
                const query = pool.request();

                parameters.forEach(element=>{
                    query.input(element.name,element.type,element.value)
                })

                const { returnValue, recordset } = await query.execute(procedure);

                switch(returnValue){
                    case 0:
                        const dbResponseEmpty : DbResponse = {
                            statusCode:0,
                            message: recordset[0].MENSAJE || 'No se obtuvo mensajes',
                            information: 'RESPUESTA VACÍA EN EL CONTROLADOR AL EJECUTAR SP'
                        }
                        resolve(dbResponseEmpty)
                        break;
                    case 1:
                        const dbResponseSuccess : DbResponse = {
                            statusCode:1,
                            message:'Consulta exitosa',
                            data: recordset,
                            information: 'RESPUESTA SATISFACTORIA AL EJECUTAR SP'
                        }
                        resolve(dbResponseSuccess)
                        break;
                    case -1:
                        const dbResponseFaileture : DbResponse = {
                            statusCode:-1,
                            message: recordset[0].MENSAJE || 'No se obtuvo mensajes',
                            information: 'ERROR CONTROLADOR AL EJECUTAR SP',
                            err: new HttpErrorResponse(recordset[0].MENSAJE||'NO SE PUDO EJECUTAR LA CONSULTA, ERROR INTERNO DE SP')
                        }
                        reject(dbResponseFaileture)
                    default:
                        const dbResponseDefault : DbResponse = {
                            statusCode:-1,
                            message: recordset[0].MENSAJE || 'No se obtuvo mensajes',
                            information: 'ERROR DEFAULT EN EL CONTROLADOR AL EJECUTAR SP',
                            err: new HttpErrorResponse('RESPUESTA DEL SP NO ESPERADA',500)
                        };
                        reject(dbResponseDefault)
                }

            } catch (error) {
                console.log(error);

                const dbResponse : DbResponse = {
                    statusCode:-1,
                    message:'No se obtuvo mensajes',
                    information: 'ERROR AL EJECUTAR SP',
                    err: new HttpErrorResponse('RESPUESTA DEL SP NO ESPERADA',500)
                };
                reject(dbResponse);

            } finally{

                if(pool && typeof pool.close === 'function'){
                    pool.close()
                }
            }
        })
    }
}