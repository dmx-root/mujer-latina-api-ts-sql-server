import { signIn }               from '../../controllers/auth/local/auth.controllers.local.signIn';
import { login }                from '../../controllers/auth/local/auth.controllers.local.login';
import { authByToken } from '../../controllers/auth/local/auth.controllers.local.authByToken';
import { routesAutentication }  from '../../middlewares/authRoutes';
import { Router }               from 'express';

export class AuthLocalRouter {

    public authLocalRouter=Router();

    constructor(){
        this.inizialicer();
    }

    inizialicer(){
        this.authLocalRouter.get('/login/',             login);
        this.authLocalRouter.post('/signin/',           signIn);
        this.authLocalRouter.get('/auth-by-token/', [routesAutentication([1,2,3,4,5])], authByToken);
    }
}