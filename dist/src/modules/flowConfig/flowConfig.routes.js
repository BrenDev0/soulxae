"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeFlowConfigRouter = void 0;
const express_1 = require("express");
const Container_1 = __importDefault(require("../../core/dependencies/Container"));
const initializeFlowConfigRouter = (customController) => {
    const router = (0, express_1.Router)();
    const secureRouter = (0, express_1.Router)();
    const middlewareService = Container_1.default.resolve("MiddlewareService");
    const controller = customController !== null && customController !== void 0 ? customController : Container_1.default.resolve("FlowConfigController");
    secureRouter.use(middlewareService.auth.bind(middlewareService));
    // protected Routes //
    secureRouter.post("/create/:agentId", 
    /*
   #swagger.tags = ['FlowConfig']
   #swagger.path =  '/flow-config/secure/create/{agentId}'
   #swagger.security = [{ "bearerAuth": [] }]
   #swagger.description = 'create flow configuration'
   #swagger.requestBody = {
       required: true,
       content: {
           "application/json": {
               schema: { $ref: "#/components/schemas/createFlowConfig" }
           }
       }
   }
   */
    controller.createRequest.bind(controller));
    secureRouter.get("/resource/:agentId", 
    /*
   #swagger.tags = ['FlowConfig']
   #swagger.path =  '/flow-config/secure/resource/{agentId}'
   #swagger.security = [{ "bearerAuth": [] }]
   #swagger.description = 'get configuration by agent'
   */
    controller.resourceRequest.bind(controller));
    secureRouter.put("/:agentId", 
    /*
   #swagger.tags = ['FlowConfig']
   #swagger.path =  '/flow-config/secure/{agentIs}'
   #swagger.security = [{ "bearerAuth": [] }]
   #swagger.description = 'updat flow configuration'
   #swagger.requestBody = {
       required: true,
       content: {
           "application/json": {
               schema: { $ref: "#/components/schemas/updateFlowConfig" }
           }
       }
   }
   */
    controller.updateRequest.bind(controller));
    secureRouter.delete("/:agentId", 
    /*
   #swagger.tags = ['FlowConfig']
   #swagger.path =  '/flow-config/secure/{agentId}'
   #swagger.security = [{ "bearerAuth": [] }]
   #swagger.description = 'delete agent config'
   */
    controller.updateRequest.bind(controller));
    // mounts //
    router.use("/secure", secureRouter);
    console.log("FlowConfig router initialized.");
    return router;
};
exports.initializeFlowConfigRouter = initializeFlowConfigRouter;
