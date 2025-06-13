import { Router } from 'express';
import Container from '../../core/dependencies/Container';
import MiddlewareService from '../../core/middleware/MiddlewareService';
import ClientsController from './ClientsController';

export const initializeClientsRouter = (customController?: ClientsController) => {
    const router = Router();
    const secureRouter = Router();
    const middlewareService = Container.resolve<MiddlewareService>("MiddlewareService");
    const controller = customController ?? Container.resolve<ClientsController>("ClientsController");

    secureRouter.use(middlewareService.auth.bind(middlewareService));

    // protected Routes //
    secureRouter.get("/resource/:clientId", 
         /*
        #swagger.tags = ['Clients']
        #swagger.path =  '/clients/secure/resource/{clientId}'
        #swagger.security = [{ "bearerAuth": [] }] 
        #swagger.description = 'Get client by id'
       
        */
       controller.resourceRequest.bind(controller)
    )

    secureRouter.get("/collection/:agentId", 
         /*
        #swagger.tags = ['Clients']
        #swagger.path =  '/clients/secure/collection/{agentId}'
        #swagger.security = [{ "bearerAuth": [] }] 
        #swagger.description = 'Get agents clients'
        */
       controller.resourceRequest.bind(controller)
    )

    secureRouter.delete("/:clientId",
        /*
        #swagger.tags = ['Clients']
        #swagger.path =  '/clients/secure/{clientId}'
        #swagger.security = [{ "bearerAuth": [] }] 
        #swagger.description = 'delete client by id'
        */
        controller.deleteRequest.bind(controller)
    )

  

    // mounts //

    router.use("/secure", secureRouter);

    console.log("Clients router initialized.");
    return router;
}
