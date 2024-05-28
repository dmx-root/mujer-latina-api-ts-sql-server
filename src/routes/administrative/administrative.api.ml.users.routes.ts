import { getOne }               from '../../controllers/administrative/users/administrative.controllers.users.getOne';
import { routesAutentication }  from '../../middlewares/authRoutes'
import { getUserListWS } from '../../controllers/administrative/users/administrative.controllers.users.getUserLisWS';
import { Router }               from 'express';


export class AdministrativeUserRouter{
    
    public userRouter=Router();

    constructor(){
        this.inizialicer();
    }

    inizialicer(){

        // this.userRouter.get('/list/',        getList);
        this.userRouter.get('/element/:id', [routesAutentication([1,2,3,4,5])],getOne);
        this.userRouter.get('/list-by-web-service/', getUserListWS)
        // this.userRouter.get('/get/filter/byDate/',);
    }
}