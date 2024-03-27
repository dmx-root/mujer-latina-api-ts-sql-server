import { Router }                       from 'express';
import { ProductionOpControllers }     from '../../controllers/production/production.api.ml.op.controllers';

export class ProductionOpRouter extends ProductionOpControllers{
    
    public opRouter=Router();

    constructor(){
        super();
        this.inizialicer();
    }

    inizialicer(){
        this.opRouter.get('/get/all/',          this.getList);
        this.opRouter.get('/get/one/:id',       this.getOne);
        this.opRouter.get('/get/details/:id',   this.getDetails);

        this.opRouter.get('/insert/details',                    this.insertListDetailOp);

        this.opRouter.get('/get/filter/byProcesseState/:id',    this.getListFilterByProcesseState);
        this.opRouter.get('/get/filter/byReference/:id',        this.getListFilterByReference);
        this.opRouter.get('/get/filter/byType/:id',             this.getListFilterByType);
        this.opRouter.get('/get/filter/byUser/:id',             this.getListFilterByUser);

    }
}