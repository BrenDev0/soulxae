"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeAiToolsRouter = void 0;
const express_1 = require("express");
const Container_1 = __importDefault(require("../../core/dependencies/Container"));
const initializeAiToolsRouter = (customController) => {
    const router = (0, express_1.Router)();
    const secureRouter = (0, express_1.Router)();
    const middlewareService = Container_1.default.resolve("MiddlewareService");
    const controller = customController !== null && customController !== void 0 ? customController : Container_1.default.resolve("AiToolsController");
    secureRouter.use(middlewareService.auth.bind(middlewareService));
    // protected Routes //
    secureRouter.post("/create", 
    /*
    #swagger.tags = ['AiTools']
    #swagger.path =  '/aiTools/secure/create'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.description = 'Add tools to ai config'
    #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/addAiTools" }
            }
        }
    }
        */
    controller.createRequest.bind(controller));
    secureRouter.get("/read/:agentId", 
    /*
   #swagger.tags = ['AiTools']
   #swagger.path =  '/aiTools/secure/read/{agentId}'
   #swagger.security = [{ "bearerAuth": [] }]
   #swagger.description = 'get collection or resource'
   #swagger.parameters['resource'] = {
       in: 'query',
       description: 'resource id, if inclueded will retur sinlge tool, if excluded will return collection of agents tools',
       required: 'false',
       type: 'string',
   }
   */
    controller.getRequest.bind(controller));
    secureRouter.get("/read", 
    /*
    #swagger.tags = ['AiTools']
    #swagger.path =  '/aiTools/secure/read'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.description = 'get alltools available for agent configuration'
    */
    controller.readRequest.bind(controller));
    secureRouter.delete("/delete", 
    /*
        #swagger.tags = ['AiTools']
        #swagger.path =  '/aiTools/secure/delete'
        #swagger.security = [{ "bearerAuth": [] }]
        #swagger.description = 'remove tool from agent config'
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: { $ref: "#/components/schemas/addAiTools" }
                }
            }
        }
    */
    controller.deleteRequest.bind(controller));
    // mounts //
    router.use("/secure", secureRouter);
    console.log("AiTools router initialized.");
    return router;
};
exports.initializeAiToolsRouter = initializeAiToolsRouter;
