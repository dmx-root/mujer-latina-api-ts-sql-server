import { Router }               from 'express';
import { getList }              from '../../controllers/production/modulo/production.controllers.modulo.getList';
import { getOne }               from '../../controllers/production/modulo/production.controllers.modulo.getOne';
import { getListFilterByState } from '../../controllers/production/modulo/production.controllers.modulo.getListFilterByState';
import { getAllEmployees }      from '../../controllers/production/modulo/production.controllers.modulo.getAllEmployees';
import { getEmployeesByModulo } from '../../controllers/production/modulo/production.controllers.moculo.getEmployeesByModulo';
import { handlerEmployee }      from '../../controllers/production/modulo/production.controllers.modulo.handlerEmployee';
export class ProductionModuloRouter {
    
    public moduloRouter=Router();

    constructor(){
        this.inizialicer();
    }

    inizialicer(){
        this.moduloRouter.get('/list/',                     getList);
        this.moduloRouter.get('/list-all-employees/',       getAllEmployees);
        this.moduloRouter.get('/element/:id',               getOne);
        this.moduloRouter.get('/list-filter-by-state/:id',  getListFilterByState);
        this.moduloRouter.get('/list-filter-employee/:id',  getEmployeesByModulo);
        this.moduloRouter.put('/handler-employees',          handlerEmployee);
    }
}