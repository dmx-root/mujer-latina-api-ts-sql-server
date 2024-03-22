import { Router }                       from 'express';
import { ProductionOcrControllers }     from '../../controllers/production/production.api.ml.ocr.controllers';

export class ProductionOcrRouter extends ProductionOcrControllers {
    
    public ocrRouter=Router();

    constructor(){
        super();
        this.inizialicer();
    }

    inizialicer(){
        this.ocrRouter.get('/list/',        this.getList);
        this.ocrRouter.get('/element/:id',  this.getOne);
        
        this.ocrRouter.post('/element/',    this.insertOperation);

        this.ocrRouter.get('/list-filter-by-op-detail/',  this.getListFilterByOp);
        this.ocrRouter.get('/list-filter-by-modulo/:id',  this.getListFilterByModulo);
        this.ocrRouter.get('/list-filter-by-revise/:id',  this.getListFilterByCheckState);
        this.ocrRouter.get('/list-filter-by-event/:id',   this.getListFilterByEvent); //revision 
        this.ocrRouter.get('/list-filter-by-category/:id',this.getListFilterByCategory);
        this.ocrRouter.get('/list-filter-by-user/:id',    this.getListFilterByUser);
        
        // this.ocrRouter.get('/get/filter/byDate/',);
    }
}