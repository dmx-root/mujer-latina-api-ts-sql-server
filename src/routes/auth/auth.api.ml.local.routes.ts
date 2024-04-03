import { signIn }               from '../../controllers/auth/local/auth.controllers.local.signIn';
import { login }                from '../../controllers/auth/local/auth.controllers.local.login';
import { routesAutentication }  from '../../middlewares/authRoutes';
import { Router }               from 'express';

export class AuthLocalRouter {

    public authLocalRouter=Router();

    constructor(){
        this.inizialicer();
    }

    inizialicer(){
        this.authLocalRouter.get('/login/',     [routesAutentication([1])], login);
        this.authLocalRouter.post('/signin/',    signIn);
    }
}