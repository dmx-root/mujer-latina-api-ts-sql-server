import { SesionMobileRouter }       from './sesion.api.ml.mobile.routes';
import { SesionWebRouter }          from './sesion.api.ml.web.routes';
import { Router }                   from 'express';

export class SesionRoutes {

    private mobileRouter =   new SesionMobileRouter().mobileRouter;
    private webRouter =      new SesionWebRouter().webRouter;
    // private desktopRouter =  new SesionDesktopRouter().desktopRouter;

    public sesionRoutes=Router();

    constructor(){
        this.inizialicer();
    }

    inizialicer (){
        this.sesionRoutes.use('/mobile/',    this.mobileRouter);
        this.sesionRoutes.use('/web/',       this.webRouter);
        // this.sesionRoutes.use('/desktop/',   this.desktopRouter);

    }
}
