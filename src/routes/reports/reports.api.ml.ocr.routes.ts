import { Router }               from 'express';
// import { getListOnModuloFilterByDateMomentGeneral } from '../../controllers/production/ocr/production.controllers.ocr.getListOnModuloFilterByDateMomentGeneral';

export class ReportsOcrRouter {
    
    public ocrRouter=Router();

    constructor(){
        this.inizialicer();
    }

    inizialicer(){
        // this.ocrRouter.get('/list/', getListOnModuloFilterByDateMomentGeneral)
        // this.moduloRouter.get('/', updateElement);
    }
}

