import fs                                               from 'fs'
import path                                             from 'path'


export const insertDataErrorsLogs= (datos:string)=>{
    fs.appendFile(path.join(__dirname,'../../src/logs/errors_logs.txt'), datos + '\n', (err) => {
        if (err) throw err;
        console.log('Datos guardados en el archivo.');
      });
}
