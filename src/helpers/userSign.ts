import fs    from 'fs';
import jwt   from 'jsonwebtoken';
import path  from 'path';

interface PayloadInterface {
    userId:string,
    userName:string
    roleId:number,
    roleName:string,
    userDescription: string,
    documentTypeId: number,
    docuementTypeName: string
}

export const userSign : ( payLoad : PayloadInterface ) => Promise<string> = async ( payLoad : PayloadInterface ) => {
 
    const route = path.join(__dirname,'../../src/keys/private_key.pem');
    const privateKey = fs.readFileSync(route, 'utf8');
    const token = jwt.sign(payLoad, privateKey,{ algorithm: 'RS256', expiresIn:2629800});

    return token;
}