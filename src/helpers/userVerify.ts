import fs    from 'fs'
import jwt   from 'jsonwebtoken';

export const decodeToken : ( token : string ) => string | jwt.JwtPayload = ( token : string ) => {
    
    const publicKey = fs.readFileSync('../keys/public_key.pem', 'utf8');
    const verify = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
    
    return verify;
}