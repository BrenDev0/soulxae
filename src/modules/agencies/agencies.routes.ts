import { Router } from 'express';
import Container from '../../core/dependencies/Container';
import MiddlewareService from '../../core/middleware/MiddlewareService';
import AgenciesController from './AgenciesController';

export const initializeAgenciesRouter = (customController?: AgenciesController) => {
    const router = Router();
    const secureRouter = Router();
    const middlewareService = Container.resolve<MiddlewareService>("MiddlewareService");
    const controller = customController ?? Container.resolve<AgenciesController>("AgenciesController");

    secureRouter.use(middlewareService.auth.bind(middlewareService));

     /*
        #swagger.tags = ['Agencies']
        #swagger.path =  '/agencies/secure'
        #swagger.security = [{ "bearerAuth": [] }] 
        #swagger.description = 'Update agencies'
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: { $ref: "#/components/schemas/updateAgencies" }
                }
            }
        }
        */

    // protected Routes //


  

    // mounts //

    router.use("/secure", secureRouter);

    console.log("Agencies router initialized.");
    return router;
}
