"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSubscriptionsRouter = void 0;
const express_1 = require("express");
const Container_1 = __importDefault(require("../../core/dependencies/Container"));
const initializeSubscriptionsRouter = (customController) => {
    const router = (0, express_1.Router)();
    const secureRouter = (0, express_1.Router)();
    const middlewareService = Container_1.default.resolve("MiddlewareService");
    const controller = customController !== null && customController !== void 0 ? customController : Container_1.default.resolve("SubscriptionsController");
    secureRouter.use(middlewareService.auth.bind(middlewareService));
    /*
       #swagger.tags = ['Subscriptions']
       #swagger.path =  '/subscriptions/secure'
       #swagger.security = [{ "bearerAuth": [] }]
       #swagger.description = 'Update subscriptions'
       #swagger.requestBody = {
           required: true,
           content: {
               "application/json": {
                   schema: { $ref: "#/components/schemas/updateSubscriptions" }
               }
           }
       }
       */
    // protected Routes //
    // mounts //
    router.use("/secure", secureRouter);
    console.log("Subscriptions router initialized.");
    return router;
};
exports.initializeSubscriptionsRouter = initializeSubscriptionsRouter;
