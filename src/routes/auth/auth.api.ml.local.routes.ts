import {Router} from 'express';
import { AuthLocalControllers } from '../../controllers/auth/auth.api.ml.local.controllers'

export class AuthLocalRouter extends AuthLocalControllers {

    public authLocalRouter=Router();

    constructor(){
        super();
        this.inizialicer();
    }

    inizialicer(){
        this.authLocalRouter.get('/login/',     this.login);
        this.authLocalRouter.get('/sign-in/',   this.signIn);
    }
}