import { Router } from 'express';
import Container from '../../core/dependencies/Container';
import MiddlewareService from '../../core/middleware/MiddlewareService';
import DirectMessagagingController from './DirectMessagingController';

export const initializeDirectMessageingRouter = (customController?: DirectMessagagingController) => {
    const router = Router();
    const secureRouter = Router();
    const middlewareService = Container.resolve<MiddlewareService>("MiddlewareService");
    const controller = customController ?? Container.resolve<DirectMessagagingController>("DirecMessagingController");

    secureRouter.use(middlewareService.auth.bind(middlewareService));

    // protected Routes //

    // unprotected Routes //
    router.post("/:id/webhook", controller.incomingMessage.bind(controller));

    // mounts //

    router.use("/secure", secureRouter);

    console.log("Direct Messaging router initialized.");
    return router;
}
