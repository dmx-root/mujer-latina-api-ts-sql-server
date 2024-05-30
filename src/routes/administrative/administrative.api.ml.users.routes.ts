import { getOne }               from '../../controllers/administrative/users/administrative.controllers.users.getOne';
import { getUserListWS } from '../../controllers/administrative/users/administrative.controllers.users.getUserLisWS';
import { getUserListDB } from '../../controllers/administrative/users/administrative.controllers.users.getUserListDB';
import { getUserWS } from '../../controllers/administrative/users/administrative.controllers.users.getOneWS';

import { Router }               from 'express';

export class AdministrativeUserRouter{
    
    public userRouter=Router();

    constructor(){
        this.inizialicer();
    }

    inizialicer(){
        this.userRouter.get('/element-by-data-base/:id',    getOne);
        this.userRouter.get('/element-by-web-service',      getUserWS);
        this.userRouter.get('/list-by-web-service/',        getUserListWS);
        this.userRouter.get('/list-by-data-base/',          getUserListDB);
    }
}