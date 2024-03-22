import { Router } from "express";
import { SesionMobileController } from '../../controllers/sesion/sesion.api.ml.mobile.controllers'

export class SesionMobileRouter extends SesionMobileController{
    public mobileRouter = Router();
    constructor(){
        super()
        this.inizialicer();
    }
    inizialicer(){
        this.mobileRouter.get('/get/operation/:id',this.getOperations);
        this.mobileRouter.get('/get/menu/:id',     this.getMenu);
    }
}