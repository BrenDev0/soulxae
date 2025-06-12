"use strict";
// import { Router } from 'express';
// import Container from '../../core/dependencies/Container';
// import MiddlewareService from '../../core/middleware/MiddlewareService';
// import WhatsappController from './WhatsappController';
// export const initializeWhatsappRouter = (customController?: WhatsappController) => {
//     const router = Router();
//     const secureRouter = Router();
//     const middlewareService = Container.resolve<MiddlewareService>("MiddlewareService");
//     const controller = customController ?? Container.resolve<WhatsappController>("WhatsappController");
//     secureRouter.use(middlewareService.auth.bind(middlewareService));
//      /*
//         #swagger.tags = ['Whatsapp']
//         #swagger.path =  '/whatsapp/secure'
//         #swagger.security = [{ "bearerAuth": [] }] 
//         #swagger.description = 'Update whatsapp'
//         #swagger.requestBody = {
//             required: true,
//             content: {
//                 "application/json": {
//                     schema: { $ref: "#/components/schemas/updateWhatsapp" }
//                 }
//             }
//         }
//         */
//     // protected Routes //
//     // mounts //
//     router.use("/secure", secureRouter);
//     console.log("Whatsapp router initialized.");
//     return router;
// }
