import { Router }                       from 'express';
import { getList }                      from '../../controllers/production/ocr/production.controllers.ocr.getList'
import { getOne }                       from '../../controllers/production/ocr/production.controllers.ocr.getOne';
import { getListFilterByOp }            from '../../controllers/production/ocr/production.controllers.ocr.getListFilterByOp';
import { getListFilterByModulo }        from '../../controllers/production/ocr/production.controllers.ocr.getListFilterByModulo';
import { getListFilterByCheckState }    from '../../controllers/production/ocr/production.controllers.ocr.getListFilterByCheckState';
import { getListFilterByEvent }         from '../../controllers/production/ocr/production.controllers.ocr.getListFilterByEvent';
import { getListFilterByCategory }      from '../../controllers/production/ocr/production.controllers.ocr.getListFilterByCategory';
import { getListFilterByUser }          from '../../controllers/production/ocr/production.controllers.ocr.getListFilterByUser';
import { insertOperation }              from '../../controllers/production/ocr/production.controllers.ocr.postOperation';
import { checkElement }                 from '../../controllers/production/ocr/production.controllers.ocr.putCheckElement';
import { getListFilterByOpType }        from '../../controllers/production/ocr/production.controllers.ocr.getListFilterByOpType'
import { insertSecods }                 from '../../controllers/production/ocr/production.controllers.ocr.postSeconds';
import { insersionOperationEvents }     from '../../controllers/production/ocr/production.controllers.ocr.postOperationEvents'

export class ProductionOcrRouter {
    
    public ocrRouter=Router();

    constructor(){
        this.inizialicer();
    }

    inizialicer(){
        this.ocrRouter.get('/list/',        getList);
        this.ocrRouter.get('/element/:id',  getOne);
        
        this.ocrRouter.put('/element/',     checkElement);
        
        this.ocrRouter.post('/element/',    insertOperation);
        this.ocrRouter.post('/events/',     insersionOperationEvents);
        this.ocrRouter.post('/segundas/',   insertSecods);
        
        this.ocrRouter.get('/list-filter-by-category/',   getListFilterByCategory);
        this.ocrRouter.get('/list-filter-by-modulo/',  getListFilterByModulo);
        this.ocrRouter.get('/list-filter-by-revise/',     getListFilterByCheckState);
        this.ocrRouter.get('/list-filter-by-op-type/',    getListFilterByOpType);
        this.ocrRouter.get('/list-filter-by-event/',      getListFilterByEvent); 
        this.ocrRouter.get('/list-filter-by-op-detail/',  getListFilterByOp);
        this.ocrRouter.get('/list-filter-by-user/',    getListFilterByUser);
    }
}