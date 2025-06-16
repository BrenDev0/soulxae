"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeMessengerRouter = void 0;
const express_1 = require("express");
const Container_1 = __importDefault(require("../../core/dependencies/Container"));
const initializeMessengerRouter = (customController) => {
    const router = (0, express_1.Router)();
    const secureRouter = (0, express_1.Router)();
    const middlewareService = Container_1.default.resolve("MiddlewareService");
    const controller = customController !== null && customController !== void 0 ? customController : Container_1.default.resolve("MessengerController");
    secureRouter.use(middlewareService.auth.bind(middlewareService));
    /*
       #swagger.tags = ['Messenger']
       #swagger.path =  '/messenger/secure'
       #swagger.security = [{ "bearerAuth": [] }]
       #swagger.description = 'Update messenger'
       #swagger.requestBody = {
           required: true,
           content: {
               "application/json": {
                   schema: { $ref: "#/components/schemas/updateMessenger" }
               }
           }
       }
       */
    // protected Routes //
    // unprotected routes //
    router.post("/:id/webhook", controller.handleIncommingMessage.bind(controller));
    router.get('/:id/webhook', controller.verifyWebhook.bind(controller));
    // mounts //
    router.use("/secure", secureRouter);
    console.log("Messenger router initialized.");
    return router;
};
exports.initializeMessengerRouter = initializeMessengerRouter;
