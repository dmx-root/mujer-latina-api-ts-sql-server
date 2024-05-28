import { Router }           from "express";
import { getOperations }    from '../../controllers/sesion/mobile/sesion.controllers.mobile.getOperations';
import { getMenu}           from '../../controllers/sesion/mobile/sesion.controllers.mobile.getListMenu';
import { getAnomalyList }   from '../../controllers/sesion/mobile/sesion.controllers.mobile.getAnomalyList';

export class SesionMobileRouter{
    public mobileRouter = Router();
    constructor(){
        this.inizialicer();
    }
    inizialicer(){
        this.mobileRouter.get('/anomaly/list',  getAnomalyList);
        this.mobileRouter.get('/operation/:id', getOperations);
        this.mobileRouter.get('/menu/',      getMenu);
    }
}