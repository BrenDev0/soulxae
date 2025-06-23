"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeAiConfigRouter = void 0;
const express_1 = require("express");
const Container_1 = __importDefault(require("../../core/dependencies/Container"));
const initializeAiConfigRouter = (customController) => {
    const router = (0, express_1.Router)();
    const secureRouter = (0, express_1.Router)();
    const middlewareService = Container_1.default.resolve("MiddlewareService");
    const controller = customController !== null && customController !== void 0 ? customController : Container_1.default.resolve("AiConfigController");
    secureRouter.use(middlewareService.auth.bind(middlewareService));
    // protected Routes //
    secureRouter.post("/create/:agentId", 
    /*
   #swagger.tags = ['AiConfig']
   #swagger.path =  '/ai-config/secure/create/{agentId}'
   #swagger.security = [{ "bearerAuth": [] }]
   #swagger.description = 'create ai configuration'
   #swagger.requestBody = {
       required: true,
       content: {
           "application/json": {
               schema: { $ref: "#/components/schemas/createAiConfig" }
           }
       }
   }
   */
    controller.createRequest.bind(controller));
    secureRouter.get("/resource/:agentId", 
    /*
   #swagger.tags = ['AiConfig']
   #swagger.path =  '/ai-config/secure/resource/{agentId}'
   #swagger.security = [{ "bearerAuth": [] }]
   #swagger.description = 'get configuration by agent'
   */
    controller.resourceRequest.bind(controller));
    secureRouter.put("/:agentId", 
    /*
   #swagger.tags = ['AiConfig']
   #swagger.path =  '/ai-config/secure/{agentIs}'
   #swagger.security = [{ "bearerAuth": [] }]
   #swagger.description = 'create ai configuration'
   #swagger.requestBody = {
       required: true,
       content: {
           "application/json": {
               schema: { $ref: "#/components/schemas/updateAiConfig" }
           }
       }
   }
   */
    controller.updateRequest.bind(controller));
    secureRouter.delete("/:agentId", 
    /*
   #swagger.tags = ['AiConfig']
   #swagger.path =  '/ai-config/secure/{agentId}'
   #swagger.security = [{ "bearerAuth": [] }]
   #swagger.description = 'delete agent config'
   */
    controller.updateRequest.bind(controller));
    // mounts //
    router.use("/secure", secureRouter);
    console.log("AiConfig router initialized.");
    return router;
};
exports.initializeAiConfigRouter = initializeAiConfigRouter;
