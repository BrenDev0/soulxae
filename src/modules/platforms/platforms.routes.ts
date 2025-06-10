import { Router } from 'express';
import Container from '../../core/dependencies/Container';
import MiddlewareService from '../../core/middleware/MiddlewareService';
import PlatformsController from './PlatformsController';

export const initializePlatformsRouter = (customController?: PlatformsController) => {
    const router = Router();
    const secureRouter = Router();
    const middlewareService = Container.resolve<MiddlewareService>("MiddlewareService");
    const controller = customController ?? Container.resolve<PlatformsController>("PlatformsController");

    secureRouter.use(middlewareService.auth.bind(middlewareService));

    // protected Routes //

    secureRouter.post("/create",
        /*
        #swagger.tags = ['Platforms']
        #swagger.path =  '/platforms/secure/create'
        #swagger.security = [{ "bearerAuth": [] }] 
        #swagger.description = 'Update platforms'
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: { $ref: "#/components/schemas/createPlatform" }
                }
            }
        }
        */
        controller.createRequest.bind(controller)
    )

    secureRouter.get("/resource/:platformId",
        /*
        #swagger.tags = ['Platforms']
        #swagger.path =  '/platforms/secure/resource/{platformId}'
        #swagger.security = [{ "bearerAuth": [] }] 
        #swagger.description = 'get platform by id'
        */
        controller.resourceRequest.bind(controller)
    )

    secureRouter.get("/collection/:agentId",
        /*
        #swagger.tags = ['Platforms']
        #swagger.path =  '/platforms/secure/collection/{agentId}'
        #swagger.security = [{ "bearerAuth": [] }] 
        #swagger.description = 'get agents platforms'
        */
        controller.collectionRequest.bind(controller)
    )

    secureRouter.put("/:platformId", 
        /*
        #swagger.tags = ['Platforms']
        #swagger.path =  '/platforms/secure/{platformId}'
        #swagger.security = [{ "bearerAuth": [] }] 
        #swagger.description = 'Update platform'
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: { $ref: "#/components/schemas/updatePlatform" }
                }
            }
        }
        */
        controller.updateRequest.bind(controller)
    )

    secureRouter.delete("/:platformId",
        /*
        #swagger.tags = ['Platforms']
        #swagger.path =  '/platforms/secure/{platformId}'
        #swagger.security = [{ "bearerAuth": [] }] 
        #swagger.description = 'delete platform by id'
        */
        controller.deleteRequest.bind(controller)
    )

  

    // mounts //

    router.use("/secure", secureRouter);

    console.log("Platforms router initialized.");
    return router;
}
