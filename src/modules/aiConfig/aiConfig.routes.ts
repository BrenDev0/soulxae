import { Router } from 'express';
import Container from '../../core/dependencies/Container';
import MiddlewareService from '../../core/middleware/MiddlewareService';
import AiConfigController from './AiConfigController';

export const initializeAiConfigRouter = (customController?: AiConfigController) => {
    const router = Router();
    const secureRouter = Router();
    const middlewareService = Container.resolve<MiddlewareService>("MiddlewareService");
    const controller = customController ?? Container.resolve<AiConfigController>("AiConfigController");

    secureRouter.use(middlewareService.auth.bind(middlewareService));

    // protected Routes //
    secureRouter.post("/create/:agentId",
         /*
        #swagger.tags = ['AiConfig']
        #swagger.path =  '/ai-config/secure/create/{agentId}'
        #swagger.security = [{ "bearerAuth": [] }] 
        #swagger.description = 'create ai configuration'
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: { $ref: "#/components/schemas/createAiConfig" }
                }
            }
        }
        */
       controller.createRequest.bind(controller)
    )

    secureRouter.get("/resource/:agentId",
         /*
        #swagger.tags = ['AiConfig']
        #swagger.path =  '/ai-config/secure/resource/{agentId}'
        #swagger.security = [{ "bearerAuth": [] }] 
        #swagger.description = 'get configuration by agent'
        */
        controller.resourceRequest.bind(controller)
    )

    secureRouter.put("/:agentId",
         /*
        #swagger.tags = ['AiConfig']
        #swagger.path =  '/ai-config/secure/{agentIs}'
        #swagger.security = [{ "bearerAuth": [] }] 
        #swagger.description = 'create ai configuration'
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: { $ref: "#/components/schemas/updateAiConfig" }
                }
            }
        }
        */
        controller.updateRequest.bind(controller)
    )

    secureRouter.delete("/:agentId", 
         /*
        #swagger.tags = ['AiConfig']
        #swagger.path =  '/ai-config/secure/{agentId}'
        #swagger.security = [{ "bearerAuth": [] }] 
        #swagger.description = 'delete agent config'
        */
        controller.updateRequest.bind(controller)
    )

  

    // mounts //

    router.use("/secure", secureRouter);

    console.log("AiConfig router initialized.");
    return router;
}
