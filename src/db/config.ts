import { CONFIGURE } from '../config'

export const dbConfig = {
    user:CONFIGURE.DB_USER,
    password:CONFIGURE.DB_PASSWORD,
    server:CONFIGURE.DB_HOST||'',
    database:CONFIGURE.DB_DATABASE,
    pool:{
        max:10,
        min:0,
        idleTimeoutMillis:30000,
    },
    options:{
        encrypt:true,
        trustServerCertificate:true
    }
}