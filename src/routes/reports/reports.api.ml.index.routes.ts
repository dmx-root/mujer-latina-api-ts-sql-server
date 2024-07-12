import { Router}                        from 'express';
import { ReportsModuloRouter } from './reports.api.ml.modulo.routes';
import { ReportsOcrRouter } from './reports.api.ml.ocr.routes';

export class ReportsRoutes {

    private ocrRouter=      new ReportsOcrRouter().ocrRouter;
    private moduloRouter =  new ReportsModuloRouter().moduloRouter;

    public reportsRoutes=Router();

    constructor(){
        this.inizialicer();
    }

    inizialicer (){
        this.reportsRoutes.use('/ocr/',      this.ocrRouter);
        this.reportsRoutes.use('/modulo/',   this.moduloRouter)
    }

}