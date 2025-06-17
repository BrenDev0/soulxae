import { Router } from 'express';
import Container from '../../core/dependencies/Container';
import MiddlewareService from '../../core/middleware/MiddlewareService';
import AgentsController from './AgentsController';

export const initializeAgentsRouter = (customController?: AgentsController) => {
    const router = Router();
    const secureRouter = Router();
    const middlewareService = Container.resolve<MiddlewareService>("MiddlewareService");
    const controller = customController ?? Container.resolve<AgentsController>("AgentsController");

    secureRouter.use(middlewareService.auth.bind(middlewareService));

    // protected Routes //
    secureRouter.post("/create",
         /*
        #swagger.tags = ['Agents']
        #swagger.path =  '/agents/secure/create'
        #swagger.security = [{ "bearerAuth": [] }] 
        #swagger.description = 'create agent'
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: { $ref: "#/components/schemas/createAgent" }
                }
            }
        }
        */
        controller.createRequest.bind(controller)
    )

    secureRouter.get("/resource/:agentId", 
         /*
        #swagger.tags = ['Agents']
        #swagger.path =  '/agents/secure/resource/{agentId}'
        #swagger.security = [{ "bearerAuth": [] }] 
        #swagger.description = 'get agent by id'
        */
        controller.resourceRequest.bind(controller)
    )

    secureRouter.get("/collection/:userId", 
         /*
        #swagger.tags = ['Agents']
        #swagger.path =  '/agents/secure/collection/{userId}'
        #swagger.security = [{ "bearerAuth": [] }] 
        #swagger.description = 'get agents by workspace'
        */
        controller.collectionRequest.bind(controller)
    )

    secureRouter.put("/:agentId", 
         /*
        #swagger.tags = ['Agents']
        #swagger.path =  '/agents/secure/{agentId}'
        #swagger.security = [{ "bearerAuth": [] }] 
        #swagger.description = 'update agent'
        */
        controller.updateRequest.bind(controller)
    )

    secureRouter.delete("/:agentId", 
        /*
        #swagger.tags = ['Agents']
        #swagger.path =  '/agents/secure/{agentId}'
        #swagger.security = [{ "bearerAuth": [] }] 
        #swagger.description = 'delete agent'
        */
        controller.deleteRequest.bind(controller)
    )
  

    // mounts //

    router.use("/secure", secureRouter);

    console.log("Agents router initialized.");
    return router;
}
