import { getOne }               from '../../controllers/administrative/users/administrative.controllers.users.getOne';
import { routesAutentication }  from '../../middlewares/authRoutes'
import { getUserListWS } from '../../controllers/administrative/users/administrative.controllers.users.getUserLisWS';
import { getUserListDB } from '../../controllers/administrative/users/administrative.controllers.users.getUserListDB';
import { Router }               from 'express';

export class AdministrativeUserRouter{
    
    public userRouter=Router();

    constructor(){
        this.inizialicer();
    }

    inizialicer(){
        this.userRouter.get('/element/:id',             getOne);
        this.userRouter.get('/list-by-web-service/',    getUserListWS)
        this.userRouter.get('/list-by-data-base/',      getUserListDB)
    }
}