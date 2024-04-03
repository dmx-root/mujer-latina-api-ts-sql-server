import { Router }               from 'express';
import { getList }              from '../../controllers/production/modulo/production.controllers.modulo.getList';
import { getOne }               from '../../controllers/production/modulo/production.controllers.modulo.getOne';
import { getListFilterByState } from '../../controllers/production/modulo/production.controllers.modulo.getListFilterByState';

export class ProductionModuloRouter {
    
    public moduloRouter=Router();

    constructor(){
        this.inizialicer();
    }

    inizialicer(){
        this.moduloRouter.get('/list/',         getList);
        this.moduloRouter.get('/element/:id',   getOne);
        this.moduloRouter.get('/list-filter-by-state/:id',   getListFilterByState);
    }
}