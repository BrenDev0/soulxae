"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeWhatsappRouter = void 0;
const express_1 = require("express");
const Container_1 = __importDefault(require("../../core/dependencies/Container"));
const initializeWhatsappRouter = (customController) => {
    const router = (0, express_1.Router)();
    const secureRouter = (0, express_1.Router)();
    const middlewareService = Container_1.default.resolve("MiddlewareService");
    const controller = customController !== null && customController !== void 0 ? customController : Container_1.default.resolve("WhatsappController");
    secureRouter.use(middlewareService.auth.bind(middlewareService));
    /*
       #swagger.tags = ['Whatsapp']
       #swagger.path =  '/whatsapp/secure'
       #swagger.security = [{ "bearerAuth": [] }]
       #swagger.description = 'Update whatsapp'
       #swagger.requestBody = {
           required: true,
           content: {
               "application/json": {
                   schema: { $ref: "#/components/schemas/updateWhatsapp" }
               }
           }
       }
       */
    // protected Routes //
    // unprotected routes //
    router.get('/:id/webhook', controller.verifyWebhook.bind(controller));
    // mounts //
    router.use("/secure", secureRouter);
    console.log("Whatsapp router initialized.");
    return router;
};
exports.initializeWhatsappRouter = initializeWhatsappRouter;
