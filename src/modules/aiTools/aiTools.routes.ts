import { Router } from 'express';
import Container from '../../core/dependencies/Container';
import MiddlewareService from '../../core/middleware/MiddlewareService';
import AiToolsController from './AiToolsController';

export const initializeAiToolsRouter = (customController?: AiToolsController) => {
    const router = Router();
    const secureRouter = Router();
    const middlewareService = Container.resolve<MiddlewareService>("MiddlewareService");
    const controller = customController ?? Container.resolve<AiToolsController>("AiToolsController");

    secureRouter.use(middlewareService.auth.bind(middlewareService));

    // protected Routes //
    secureRouter.post("/create",
        /*
        #swagger.tags = ['AiTools']
        #swagger.path =  '/aiTools/secure/create'
        #swagger.security = [{ "bearerAuth": [] }] 
        #swagger.description = 'Add tools to ai config'
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: { $ref: "#/components/schemas/addAiTools" }
                }
            }
        }
            */
        controller.createRequest.bind(controller)
    )

    secureRouter.get("/read/:agentId", 
         /*
        #swagger.tags = ['AiTools']
        #swagger.path =  '/aiTools/secure/read/{agentId}'
        #swagger.security = [{ "bearerAuth": [] }] 
        #swagger.description = 'get collection or resource'
        #swagger.parameters['resource'] = { 
            in: 'query',            
            description: 'resource id, if inclueded will retur sinlge tool, if excluded will return collection of agents tools',                   
            required: 'false',                     
            type: 'string',                             
        }
        */
        controller.getRequest.bind(controller)
    )

    secureRouter.get("/read", 
        /*
        #swagger.tags = ['AiTools']
        #swagger.path =  '/aiTools/secure/read'
        #swagger.security = [{ "bearerAuth": [] }] 
        #swagger.description = 'get alltools available for agent configuration'
        */
        controller.readRequest.bind(controller)
    )

    secureRouter.delete("/delete",
        /*
            #swagger.tags = ['AiTools']
            #swagger.path =  '/aiTools/secure/delete'
            #swagger.security = [{ "bearerAuth": [] }] 
            #swagger.description = 'remove tool from agent config'
            #swagger.requestBody = {
                required: true,
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/addAiTools" }
                    }
                }
            }
        */
        controller.deleteRequest.bind(controller)
    )
  

    // mounts //

    router.use("/secure", secureRouter);

    console.log("AiTools router initialized.");
    return router;
}
