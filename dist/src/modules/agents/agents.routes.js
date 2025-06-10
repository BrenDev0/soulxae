"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeAgentsRouter = void 0;
const express_1 = require("express");
const Container_1 = __importDefault(require("../../core/dependencies/Container"));
const initializeAgentsRouter = (customController) => {
    const router = (0, express_1.Router)();
    const secureRouter = (0, express_1.Router)();
    const middlewareService = Container_1.default.resolve("MiddlewareService");
    const controller = customController !== null && customController !== void 0 ? customController : Container_1.default.resolve("AgentsController");
    secureRouter.use(middlewareService.auth.bind(middlewareService));
    // protected Routes //
    secureRouter.post("/create", 
    /*
   #swagger.tags = ['Agents']
   #swagger.path =  '/agents/secure/create'
   #swagger.security = [{ "bearerAuth": [] }]
   #swagger.description = 'create agent'
   #swagger.requestBody = {
       required: true,
       content: {
           "application/json": {
               schema: { $ref: "#/components/schemas/createAgent" }
           }
       }
   }
   */
    controller.createRequest.bind(controller));
    secureRouter.get("/resource/:agentId", 
    /*
   #swagger.tags = ['Agents']
   #swagger.path =  '/agents/secure/resource/{agentId}'
   #swagger.security = [{ "bearerAuth": [] }]
   #swagger.description = 'get agent by id'
   */
    controller.resourceRequest.bind(controller));
    secureRouter.get("/collection/:workspaceId", 
    /*
   #swagger.tags = ['Agents']
   #swagger.path =  '/agents/secure/collection/{workspaceId}'
   #swagger.security = [{ "bearerAuth": [] }]
   #swagger.description = 'get agents by workspace'
   */
    controller.collectionRequest.bind(controller));
    secureRouter.put("/:agentId", 
    /*
   #swagger.tags = ['Agents']
   #swagger.path =  '/agents/secure/{agentId}'
   #swagger.security = [{ "bearerAuth": [] }]
   #swagger.description = 'update agent'
   */
    controller.updateRequest.bind(controller));
    secureRouter.delete("/:agentId", 
    /*
    #swagger.tags = ['Agents']
    #swagger.path =  '/agents/secure/{agentId}'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.description = 'delete agent'
    */
    controller.deleteRequest.bind(controller));
    // mounts //
    router.use("/secure", secureRouter);
    console.log("Agents router initialized.");
    return router;
};
exports.initializeAgentsRouter = initializeAgentsRouter;
