import { Application }              from 'express';
import { AuthRoutes }               from './auth/auth.api.ml.index.routes';
import { ProductionRoutes }         from './production/production.api.ml.index.routes';
import { AdministrativeRoutes }     from './administrative/administrative.api.ml.index.routes';
import { SesionRoutes }             from './sesion/sesion.api.ml.index.routes';

export class Routes {

    private productionRoutes =      new ProductionRoutes();
    private administrativeRoutes =  new AdministrativeRoutes();
    private authRoutes =            new AuthRoutes();
    private sesionRoutes =          new SesionRoutes();

    constructor(app:Application){
        
        app.use('/api/v1/ml/production/',      this.productionRoutes.productionRoutes);
        app.use('/api/v1/ml/administrative/',  this.administrativeRoutes.administrativeRoutes);
        app.use('/api/v1/ml/sesion/',          this.sesionRoutes.sesionRoutes)
        app.use('/api/v1/ml/auth/',            this.authRoutes.authRoutes)

    }
}
