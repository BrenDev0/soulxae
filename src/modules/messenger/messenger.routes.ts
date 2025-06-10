// import { Router } from 'express';
// import Container from '../../core/dependencies/Container';
// import MiddlewareService from '../../core/middleware/MiddlewareService';
// import MessengerController from './MessengerController';

// export const initializeMessengerRouter = (customController?: MessengerController) => {
//     const router = Router();
//     const secureRouter = Router();
//     const middlewareService = Container.resolve<MiddlewareService>("MiddlewareService");
//     const controller = customController ?? Container.resolve<MessengerController>("MessengerController");

//     secureRouter.use(middlewareService.auth.bind(middlewareService));

//      /*
//         #swagger.tags = ['Messenger']
//         #swagger.path =  '/messenger/secure'
//         #swagger.security = [{ "bearerAuth": [] }] 
//         #swagger.description = 'Update messenger'
//         #swagger.requestBody = {
//             required: true,
//             content: {
//                 "application/json": {
//                     schema: { $ref: "#/components/schemas/updateMessenger" }
//                 }
//             }
//         }
//         */

//     // protected Routes //


  

//     // mounts //

//     router.use("/secure", secureRouter);

//     console.log("Messenger router initialized.");
//     return router;
// }
