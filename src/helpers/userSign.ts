import fs    from 'fs'
import jwt   from 'jsonwebtoken';
import path  from 'path'

interface PayloadInterface {
    userId:string,
    userName:string
    roleId:number,
    roleName:string,
}

export const userSign : ( payLoad : PayloadInterface ) => Promise<string> = async ( payLoad : PayloadInterface ) => {
 
    // const privateKey = fs.readFileSync(path.join(__dirname,'../../src/keys/private_key.pem'), 'utf8');
    // const token = jwt.sign(payLoad, privateKey,{ algorithm: 'RS256', expiresIn:2629800});

    console.log(path.join(__dirname,'../../src/keys/private_key.pem'))

    return 'token';
}