import {Router} from 'express';
import { login } from '../../controllers/auth/local/auth.controllers.local.login';
import { signIn } from '../../controllers/auth/local/auth.controllers.local.signIn';

export class AuthLocalRouter {

    public authLocalRouter=Router();

    constructor(){
        this.inizialicer();
    }

    inizialicer(){
        this.authLocalRouter.get('/login/',     login);
        this.authLocalRouter.post('/signin/',    signIn);
    }
}