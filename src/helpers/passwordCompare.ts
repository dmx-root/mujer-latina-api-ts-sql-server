import bcrypt from 'bcrypt';
import { HttpErrorResponse } from '../utilities/httpErrorResponse';


interface ResponseInterface {
    statusCode:1 | 0 | -1,
    statusMessage: string,
    err?:Error
}

export const comparePassword : (hash : string, password : string ) => Promise <ResponseInterface> = async (hash : string, password : string) => {
    try {
        const compare : boolean = await bcrypt.compare(password, hash);

        if(!compare){
            const response : ResponseInterface = {
                statusCode: 0,
                statusMessage: 'Contraseña Incorrecta'
            }
            return response;
        }

        const response : ResponseInterface = {
            statusCode:1,
            statusMessage:'Contraseña correcta'
        }

        return response;
    } catch (error) {
        console.log(error)
        const response : ResponseInterface = {
            statusCode:-1,
            statusMessage:'Error en el proceso de comparación',
            err:new HttpErrorResponse('Error de controlador',500)
        }
        return response;
    }
}