import { Router } from 'express';
import Container from '../../core/dependencies/Container';
import MiddlewareService from '../../core/middleware/MiddlewareService';
import MessagesController from './MessagesController';

export const initializeMessagesRouter = (customController?: MessagesController) => {
    const router = Router();
    const secureRouter = Router();
    const middlewareService = Container.resolve<MiddlewareService>("MiddlewareService");
    const controller = customController ?? Container.resolve<MessagesController>("MessagesController");

    secureRouter.use(middlewareService.auth.bind(middlewareService));

     /*
        #swagger.tags = ['Messages']
        #swagger.path =  '/messages/secure'
        #swagger.security = [{ "bearerAuth": [] }] 
        #swagger.description = 'Update messages'
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: { $ref: "#/components/schemas/updateMessages" }
                }
            }
        }
        */

    // protected Routes //


  

    // mounts //

    router.use("/secure", secureRouter);

    console.log("Messages router initialized.");
    return router;
}
