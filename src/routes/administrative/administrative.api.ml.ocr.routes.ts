import {Router} from 'express';

export class AdministrativeOcrRouter {
    public ocrRouter=Router();
    constructor(){
        this.inizialicer();
    }

    inizialicer(){
        this.ocrRouter.get('/',async ()=>{console.log('se obtuvo la info')});
    }
}