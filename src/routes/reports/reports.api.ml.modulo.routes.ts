import { Router }               from 'express';
import { getProductionReports } from '../../controllers/reports/modulo/reports.controllers.modulo.getProductionReports'

export class ReportsModuloRouter {
    
    public moduloRouter=Router();

    constructor(){
        this.inizialicer();
    }

    inizialicer(){
        this.moduloRouter.get('/production/:id', getProductionReports);
    }
}