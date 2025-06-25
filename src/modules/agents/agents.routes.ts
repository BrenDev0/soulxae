import { Router } from 'express';
import Container from '../../core/dependencies/Container';
import MiddlewareService from '../../core/middleware/MiddlewareService';
import AgentsController from './AgentsController';

export const initializeAgentsRouter = (customController?: AgentsController) => {
    const router = Router();
    const secureRouter = Router();
    const adminOnlyRouter = Router();
    const middlewareService = Container.resolve<MiddlewareService>("MiddlewareService");
    const controller = customController ?? Container.resolve<AgentsController>("AgentsController");

    secureRouter.use(middlewareService.auth.bind(middlewareService));
    adminOnlyRouter.use(middlewareService.adminCheck)

    // protected Routes //
    adminOnlyRouter.post("/create",
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

    adminOnlyRouter.get("/resource/:agentId", 
         /*
        #swagger.tags = ['Agents']
        #swagger.path =  '/agents/secure/resource/{agentId}'
        #swagger.security = [{ "bearerAuth": [] }] 
        #swagger.description = 'get agent by id'
        */
        controller.resourceRequest.bind(controller)
    )

    adminOnlyRouter.get("/collection", 
         /*
        #swagger.tags = ['Agents']
        #swagger.path =  '/agents/secure/collection'
        #swagger.security = [{ "bearerAuth": [] }] 
        #swagger.description = 'get agents by user'
        */
        controller.collectionRequest.bind(controller)
    )

    adminOnlyRouter.put("/:agentId", 
         /*
        #swagger.tags = ['Agents']
        #swagger.path =  '/agents/secure/{agentId}'
        #swagger.security = [{ "bearerAuth": [] }] 
        #swagger.description = 'update agent'
        */
        controller.updateRequest.bind(controller)
    )

    adminOnlyRouter.delete("/:agentId", 
        /*
        #swagger.tags = ['Agents']
        #swagger.path =  '/agents/secure/{agentId}'
        #swagger.security = [{ "bearerAuth": [] }] 
        #swagger.description = 'delete agent'
        */
        controller.deleteRequest.bind(controller)
    )
  

    // mounts //
    secureRouter.use(adminOnlyRouter);
    router.use("/secure", secureRouter);

    console.log("Agents router initialized.");
    return router;
}
