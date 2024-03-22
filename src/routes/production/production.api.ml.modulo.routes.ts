import { Router }       from 'express';
import { ProductionModuloControllers  } from '../../controllers/production/production.api.ml.modulo.controllers';

export class ProductionModuloRouter extends ProductionModuloControllers{
    
    public moduloRouter=Router();

    constructor(){
        super();
        this.inizialicer();
    }

    inizialicer(){
        this.moduloRouter.get('/get/all/',    this.getList);
        this.moduloRouter.get('/get/one/:id', this.getOne);

        this.moduloRouter.get('/get/filter/byState/:id',   this.getListFilterByState);

    }
}