import { Router } from 'express';
import Container from '../../core/dependencies/Container';
import MiddlewareService from '../../core/middleware/MiddlewareService';
import DirectMessagagingController from './DirectMessagingController';

export const initializeDirectMessageingRouter = (customController?: DirectMessagagingController) => {
    const router = Router();
    const secureRouter = Router();
    const middlewareService = Container.resolve<MiddlewareService>("MiddlewareService");
    const controller = customController ?? Container.resolve<DirectMessagagingController>("DirectMessagingController");

    secureRouter.use(middlewareService.auth.bind(middlewareService));

    // protected Routes //
    secureRouter.post("/send", 
         /*
        #swagger.tags = ['Messaging']
        #swagger.path =  '/direct/secure/send'
        #swagger.security = [{ "bearerAuth": [] }] 
        #swagger.description = 'send Message to client'
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: { $ref: "#/components/schemas/sendDirectMessage" }
                }
            }
        }
        */
        controller.send.bind(controller)
    )

    // unprotected Routes //
    router.post("/:id/webhook", controller.handleIncommingMessage.bind(controller));
    router.get('/:id/webhook', controller.verifyWebhook.bind(controller));
    // mounts //

    router.use("/secure", secureRouter);

    console.log("Direct Messaging router initialized.");
    return router;
}
