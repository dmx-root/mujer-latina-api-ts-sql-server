import { Router}                        from 'express';
import { AdministrativeOcrRouter }      from './administrative.api.ml.ocr.routes';
import { AdministrativeUserRouter }     from './administrative.api.ml.users.routes';
import { AdministrativeModuloRouter }   from './administrative.api.ml.modulo.routes';

export class AdministrativeRoutes {

    private ocrRouter=      new AdministrativeOcrRouter().ocrRouter;
    private userRouter =    new AdministrativeUserRouter().userRouter;
    private moduloRouter =  new AdministrativeModuloRouter().moduloRouter;

    public administrativeRoutes=Router();

    constructor(){
        this.inizialicer();
    }

    inizialicer (){
        // app.use('/op/',);
        this.administrativeRoutes.use('/ocr/',      this.ocrRouter);
        this.administrativeRoutes.use('/user/',     this.userRouter);
        this.administrativeRoutes.use('/modulo/',   this.moduloRouter)
    }

}