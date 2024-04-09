import { Router }                       from 'express';
import { insertListDetailOp }               from '../../controllers/production/op/production.controllers.op.postDetailsOp'
import { getList }                          from '../../controllers/production/op/production.controllers.op.getList'
import { getOne }                           from '../../controllers/production/op/production.controllers.op.getOne'
import { getDetails }                       from '../../controllers/production/op/production.controllers.op.getDetail'
import { getListFilterByProcesseState }     from '../../controllers/production/op/production.controllers.op.getListFilterByProcesseState'
import { getListFilterByReference }         from '../../controllers/production/op/production.controllers.op.getListFilterByReference'
import { getListFilterByType }              from '../../controllers/production/op/production.controllers.op.getListFilterByType';
import { getListFilterByUser }              from '../../controllers/production/op/production.controllers.op.getListFilterByUser';


export class ProductionOpRouter {
    
    public opRouter=Router();

    constructor(){
        this.inizialicer();
    }

    inizialicer(){
        this.opRouter.get('/list/',              getList);
        this.opRouter.get('/list-details/:id',   getDetails);
        this.opRouter.get('/element/:id',        getOne);

        this.opRouter.post('/element/',                     insertListDetailOp);

        this.opRouter.get('/list-filter-by-state/',         getListFilterByProcesseState);
        this.opRouter.get('/list-filter-by-reference/:id',  getListFilterByReference);
        this.opRouter.get('/list-filter-by-type/',          getListFilterByType);
        this.opRouter.get('/list-filter-by-user/:id',       getListFilterByUser);

    }
}