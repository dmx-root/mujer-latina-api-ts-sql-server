import { Router }           from "express";
import { getOperations }    from '../../controllers/sesion/mobile/sesion.controllers.mobile.getOperations';
import { getMenu}           from '../../controllers/sesion/mobile/sesion.controllers.mobile.getListMenu';

export class SesionMobileRouter{
    public mobileRouter = Router();
    constructor(){
        this.inizialicer();
    }
    inizialicer(){
        this.mobileRouter.get('/operation/:id', getOperations);
        this.mobileRouter.get('/menu/:id',      getMenu);
    }
}