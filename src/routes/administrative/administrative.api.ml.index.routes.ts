import {Application, Router}        from 'express';
import { AdministrativeOcrRouter } from './administrative.api.ml.ocr.routes';

export class AdministrativeRoutes {

    private ocrRouter=new AdministrativeOcrRouter().ocrRouter;
    public administrativeRoutes=Router();

    constructor(){
        this.inizialicer();
    }

    inizialicer (){
        // app.use('/op/',);
        this.administrativeRoutes.use('/ocr/',this.ocrRouter);
        // app.use('/modulo/',);
        // app.use('/users/',);
    }

}