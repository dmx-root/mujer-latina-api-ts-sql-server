import { Router }               from 'express';
import { updateElement } from '../../controllers/administrative/modulo/administrative.controllers.modulo.update'
export class AdministrativeModuloRouter {
    
    public moduloRouter=Router();

    constructor(){
        this.inizialicer();
    }

    inizialicer(){
        this.moduloRouter.put('/update/', updateElement);
    }
}