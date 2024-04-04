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
        
        this.ocrRouter.get('/list-filter-by-category/:id',getListFilterByCategory);
        this.ocrRouter.get('/list-filter-by-modulo/:id',  getListFilterByModulo);
        this.ocrRouter.get('/list-filter-by-revise/:id',  getListFilterByCheckState);
        this.ocrRouter.get('/list-filter-by-event/:id',   getListFilterByEvent); // revisar controladpr
        this.ocrRouter.get('/list-filter-by-op-detail/',  getListFilterByOp);
        this.ocrRouter.get('/list-filter-by-user/:id',    getListFilterByUser);
        
        // this.ocrRouter.get('/get/filter/byDate/',);
    }
}