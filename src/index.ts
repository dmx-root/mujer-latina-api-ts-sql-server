import express, {Application}   from 'express';
import cors, {CorsOptions}      from 'cors';
import morgan                   from 'morgan';
import cookieParser             from 'cookie-parser';
import { CONFIGURE }            from './config';
import { Routes }               from './routes/api.ml.index.routes';

export class Server {
    
    private app: Application;
    private port: String;

    constructor(){
        this.app = express();
        this.port = CONFIGURE.SERVER_PORT || '8080';
        this.config(this.app);
        this.listen();

        new Routes(this.app)

    }

    private config(app:Application):void{

        const corsConfig : CorsOptions = {
            origin: "http://localhost:3000",
            credentials: true
        };

        app.use(cors(corsConfig));
        app.use(cookieParser());
        app.use(express.json());
        app.use(express.urlencoded({extended:true}));
        app.use(morgan('dev'));
    }

    private listen(){
        this.app.listen(this.port,()=>{
            console.log(`The server ir running on port ${this.port}...`);
        })
        .on("error", (err: any) => {
            if (err.code === "EADDRINUSE") {
              console.log("Error: La dirección del puerto ya está en uso");
            } else {
              console.log(err);
            }
        });
    }
}