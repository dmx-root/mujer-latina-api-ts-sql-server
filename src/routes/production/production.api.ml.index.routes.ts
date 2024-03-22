import { Router }                   from 'express';
import { ProductionModuloRouter }   from './production.api.ml.modulo.routes';
import { ProductionOcrRouter }      from './production.api.ml.ocr.routes';
import { ProductionOpRouter }       from './production.api.ml.op.routes';

export class ProductionRoutes {

    private ocrRouter=      new ProductionOcrRouter().ocrRouter;
    private moduloRouter =  new ProductionModuloRouter().moduloRouter;
    private opRouter =      new ProductionOpRouter().opRouter;

    public productionRoutes=Router();

    constructor(){
        this.inizialicer();
    }

    inizialicer (){
        this.productionRoutes.use('/op/',       this.opRouter);
        this.productionRoutes.use('/ocr/',      this.ocrRouter);
        this.productionRoutes.use('/modulo/',   this.moduloRouter);
        // app.use('/users/',);
    }
}
