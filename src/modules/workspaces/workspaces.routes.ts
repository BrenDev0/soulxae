import { Router } from 'express';
import Container from '../../core/dependencies/Container';
import MiddlewareService from '../../core/middleware/MiddlewareService';
import WorkspacesController from './WorkspacesController';

export const initializeWorkspacesRouter = (customController?: WorkspacesController) => {
    const router = Router();
    const secureRouter = Router();
    const middlewareService = Container.resolve<MiddlewareService>("MiddlewareService");
    const controller = customController ?? Container.resolve<WorkspacesController>("WorkspacesController");

    secureRouter.use(middlewareService.auth.bind(middlewareService));

    // protected Routes //
    secureRouter.post("/create",
         /*
        #swagger.tags = ['Workspaces']
        #swagger.path =  '/workspaces/secure/create'
        #swagger.security = [{ "bearerAuth": [] }] 
        #swagger.description = 'create workspaces'
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: { $ref: "#/components/schemas/createWorkspace" }
                }
            }
        }
        */
       controller.createRequest.bind(controller)
    )

    secureRouter.get("/resource/:workspaceId",
         /*
        #swagger.tags = ['Workspaces']
        #swagger.path =  '/workspaces/secure/resource/{workspaceId}'
        #swagger.security = [{ "bearerAuth": [] }] 
        #swagger.description = 'get workspace by id'
        */
        controller.resourceRequest.bind(controller)
    )

    secureRouter.get("/collection",
         /*
        #swagger.tags = ['Workspaces']
        #swagger.path =  '/workspaces/secure/collection'
        #swagger.security = [{ "bearerAuth": [] }] 
        #swagger.description = 'get workspace by user'
        */
        controller.collectionRequest.bind(controller)
    )

    secureRouter.put("/:workspaceId", 
         /*
        #swagger.tags = ['Workspaces']
        #swagger.path =  '/workspaces/secure/{workspaceId}'
        #swagger.security = [{ "bearerAuth": [] }] 
        #swagger.description = 'update workspace'
         #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: { $ref: "#/components/schemas/updateWorkspace" }
                }
            }
        }
        */
        controller.updateRequest.bind(controller)
    )

    secureRouter.delete("/:workspaceId",
        /*
        #swagger.tags = ['Workspaces']
        #swagger.path =  '/workspaces/secure/{workspaceId}'
        #swagger.security = [{ "bearerAuth": [] }] 
        #swagger.description = 'delete workspace by id'
        */
        controller.deleteRequest.bind(controller)
    )
  

    // mounts //

    router.use("/secure", secureRouter);

    console.log("Workspaces router initialized.");
    return router;
}
