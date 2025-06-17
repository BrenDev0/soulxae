import { Router } from 'express';
import Container from '../../core/dependencies/Container';
import MiddlewareService from '../../core/middleware/MiddlewareService';
import SubscriptionsController from './SubscriptionsController';

export const initializeSubscriptionsRouter = (customController?: SubscriptionsController) => {
    const router = Router();
    const secureRouter = Router();
    const middlewareService = Container.resolve<MiddlewareService>("MiddlewareService");
    const controller = customController ?? Container.resolve<SubscriptionsController>("SubscriptionsController");

    secureRouter.use(middlewareService.auth.bind(middlewareService));

     /*
        #swagger.tags = ['Subscriptions']
        #swagger.path =  '/subscriptions/secure'
        #swagger.security = [{ "bearerAuth": [] }] 
        #swagger.description = 'Update subscriptions'
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: { $ref: "#/components/schemas/updateSubscriptions" }
                }
            }
        }
        */

    // protected Routes //


  

    // mounts //

    router.use("/secure", secureRouter);

    console.log("Subscriptions router initialized.");
    return router;
}
