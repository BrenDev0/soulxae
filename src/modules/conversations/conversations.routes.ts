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

    // protected Routes //
    secureRouter.get("/resource/:conversationId", 
         /*
        #swagger.tags = ['Conversations']
        #swagger.path =  '/conversations/secure/resource/{conversationId}'
        #swagger.security = [{ "bearerAuth": [] }] 
        #swagger.description = 'get conversation by id'
        */
        controller.resourceRequest.bind(controller)
    )

    secureRouter.get("/collection/:agentId", 
         /*
        #swagger.tags = ['Conversations']
        #swagger.path =  '/conversations/secure/collection/{agentId}'
        #swagger.security = [{ "bearerAuth": [] }] 
        #swagger.description = 'get agents conversations'
        */
        controller.collectionRequest.bind(controller)
    )

    secureRouter.delete("/:conversationId", 
         /*
        #swagger.tags = ['Conversations']
        #swagger.path =  '/conversations/secure/{conversationId}'
        #swagger.security = [{ "bearerAuth": [] }] 
        #swagger.description = 'delete converation by id'
        */
        controller.deleteRequest.bind(controller)
    )

  

    // mounts //

    router.use("/secure", secureRouter);

    console.log("Conversations router initialized.");
    return router;
}
