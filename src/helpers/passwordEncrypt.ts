import bcrypt from 'bcrypt'

interface ResponseInterface {
    statusCode:1 | 0 | -1,
    statusMessage: string,
    data?:string,
    err?:Error
}

export async function  encryptPassword(password:string):Promise<ResponseInterface>{
    try {
        const response:string|Buffer =await bcrypt.hash(password, 10);

        const bacryptResponse:ResponseInterface={
            statusCode:1,
            statusMessage: 'Acción exitosa',
            data:response
        }
        return bacryptResponse;
    } catch (error) {
        console.log(error);
        const bacryptResponse:ResponseInterface={
            statusCode:-1,
            statusMessage:'Error en la encriptación del mensaje',
            err: new Error('Hubo un error al momento de encriptar la contraseña')
        }
        return bacryptResponse;
    }
}