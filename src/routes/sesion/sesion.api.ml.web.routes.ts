import { Router }               from "express";
import { SesionWebController }  from '../../controllers/sesion/sesion.api.ml.web.controllers';

export class SesionWebRouter extends SesionWebController {

    public webRouter = Router();

    constructor(){
        super()
        this.inizialicer();
    }
    inizialicer(){
        this.webRouter.get('/get/operation/:id',this.getOperations);
        this.webRouter.get('/get/menu/:id',     this.getMenu);
    }
}