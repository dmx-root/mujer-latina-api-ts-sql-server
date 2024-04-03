import { Router } from 'express';

export class AdministrativeUserRouter{
    
    public userRouter=Router();

    constructor(){
        this.inizialicer();
    }

    inizialicer(){

        // this.userRouter.get('/list/',        getList);
        this.userRouter.get('/element/:id',  ()=>{console.log("Entró")});
        // this.userRouter.get('/get/filter/byDate/',);
    }
}