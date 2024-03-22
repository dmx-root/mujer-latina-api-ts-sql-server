import path from 'path'
import dotenv from 'dotenv'

const envPath = path.join(__dirname,'..','.env');

if(envPath){
    dotenv.config({path: envPath})
}else{
    dotenv.config()
}

const envValueValidator = (name: string) =>{
    const value = process.env[name]

    if(!value){
        throw new Error(`La variable de entorno ${name}, no fue proporcionada`)
    }
    return value;
}

export const CONFIGURE = {
    SERVER_PORT: envValueValidator('SERVER_PORT'),
    DB_PORT: envValueValidator('DB_PORT'),
    DB_HOST : envValueValidator('DB_HOST'),
    DB_USER : envValueValidator('DB_USER'),
    DB_PASSWORD : envValueValidator('DB_PASSWORD'),
    DB_DATABASE : envValueValidator('DB_DATABASE')
}