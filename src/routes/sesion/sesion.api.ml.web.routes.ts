import { Router }               from "express";
import { getMenu } from '../../controllers/sesion/web/sesion.controllers.web.getListMenu'
import { getOperations } from '../../controllers/sesion/web/sesion.controllers.web.getListOperations'

export class SesionWebRouter{

    public webRouter = Router();

    constructor(){
        this.inizialicer();
    }
    inizialicer(){

        this.webRouter.get('/operation/:id', getOperations);
        this.webRouter.get('/menu/:id',      getMenu);


    }
}