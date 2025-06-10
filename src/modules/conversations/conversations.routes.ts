import { Router } from 'express';
import Container from '../../core/dependencies/Container';
import MiddlewareService from '../../core/middleware/MiddlewareService';
import ConversationsController from './ConversationsController';

export const initializeConversationsRouter = (customController?: ConversationsController) => {
    const router = Router();
    const secureRouter = Router();
    const middlewareService = Container.resolve<MiddlewareService>("MiddlewareService");
    const controller = customController ?? Container.resolve<ConversationsController>("ConversationsController");

    secureRouter.use(middlewareService.auth.bind(middlewareService));

     /*
        #swagger.tags = ['Conversations']
        #swagger.path =  '/conversations/secure'
        #swagger.security = [{ "bearerAuth": [] }] 
        #swagger.description = 'Update conversations'
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: { $ref: "#/components/schemas/updateConversations" }
                }
            }
        }
        */

    // protected Routes //


  

    // mounts //

    router.use("/secure", secureRouter);

    console.log("Conversations router initialized.");
    return router;
}
