import { Router } from 'express';
import Container from '../../core/dependencies/Container';
import MiddlewareService from '../../core/middleware/MiddlewareService';
import FlowConfigController from './FlowConfigController';

export const initializeFlowConfigRouter = (customController?: FlowConfigController) => {
    const router = Router();
    const secureRouter = Router();
    const middlewareService = Container.resolve<MiddlewareService>("MiddlewareService");
    const controller = customController ?? Container.resolve<FlowConfigController>("FlowConfigController");

    secureRouter.use(middlewareService.auth.bind(middlewareService));

    // protected Routes //
    secureRouter.post("/create/:agentId",
         /*
        #swagger.tags = ['FlowConfig']
        #swagger.path =  '/flow-config/secure/create/{agentId}'
        #swagger.security = [{ "bearerAuth": [] }] 
        #swagger.description = 'create flow configuration'
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: { $ref: "#/components/schemas/createFlowConfig" }
                }
            }
        }
        */
       controller.createRequest.bind(controller)
    )

    secureRouter.get("/resource/:agentId",
         /*
        #swagger.tags = ['FlowConfig']
        #swagger.path =  '/flow-config/secure/resource/{agentId}'
        #swagger.security = [{ "bearerAuth": [] }] 
        #swagger.description = 'get configuration by agent'
        */
        controller.resourceRequest.bind(controller)
    )

    secureRouter.put("/:agentId",
         /*
        #swagger.tags = ['FlowConfig']
        #swagger.path =  '/flow-config/secure/{agentIs}'
        #swagger.security = [{ "bearerAuth": [] }] 
        #swagger.description = 'updat flow configuration'
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: { $ref: "#/components/schemas/updateFlowConfig" }
                }
            }
        }
        */
        controller.updateRequest.bind(controller)
    )

    secureRouter.delete("/:agentId", 
         /*
        #swagger.tags = ['FlowConfig']
        #swagger.path =  '/flow-config/secure/{agentId}'
        #swagger.security = [{ "bearerAuth": [] }] 
        #swagger.description = 'delete agent config'
        */
        controller.updateRequest.bind(controller)
    )

  

    // mounts //

    router.use("/secure", secureRouter);

    console.log("FlowConfig router initialized.");
    return router;
}
