import fs    from 'fs'
import jwt   from 'jsonwebtoken';
import path  from 'path'

interface HelperResponse {
    statusCode:1 | 0 | -1,
    statusMessage: string,
    err?:Error,
    data?: any
}

export const decodeToken : ( token : string ) => HelperResponse = ( token : string ) => {
    try {
        const route = path.join(__dirname, "../../src/keys/public_key.pem")
        const publicKey = fs.readFileSync(route, 'utf8');
        const verify = jwt.verify(token, publicKey, { algorithms: ['RS256'] });

        const response : HelperResponse = {
            statusCode: 1,
            statusMessage: "Decodificación exitosa",
            data: verify
        }
        return response;
        
    } catch (error) {
        const response : HelperResponse = {
            statusCode: 1,
            statusMessage: "Decodificación exitosa"
        }
        return response;
    }
    
}