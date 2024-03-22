import {Application, Router}        from 'express';
import { AuthLocalRouter }          from './auth.api.ml.local.routes';

export class AuthRoutes {

    private localRouter=new AuthLocalRouter().authLocalRouter;
    // private awsRouter=new AuthAwsRouter().authLocalRouter;

    public authRoutes=Router();

    constructor(){
        this.inizialicer();
    }

    inizialicer (){
        this.authRoutes.use('/local/',this.localRouter);
        // this.awsRouter.use('/aws/',);
    }
}