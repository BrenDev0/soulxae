"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeWorkspacesRouter = void 0;
const express_1 = require("express");
const Container_1 = __importDefault(require("../../core/dependencies/Container"));
const initializeWorkspacesRouter = (customController) => {
    const router = (0, express_1.Router)();
    const secureRouter = (0, express_1.Router)();
    const middlewareService = Container_1.default.resolve("MiddlewareService");
    const controller = customController !== null && customController !== void 0 ? customController : Container_1.default.resolve("WorkspacesController");
    secureRouter.use(middlewareService.auth.bind(middlewareService));
    // protected Routes //
    secureRouter.post("/create", 
    /*
   #swagger.tags = ['Workspaces']
   #swagger.path =  '/workspaces/secure/create'
   #swagger.security = [{ "bearerAuth": [] }]
   #swagger.description = 'create workspaces'
   #swagger.requestBody = {
       required: true,
       content: {
           "application/json": {
               schema: { $ref: "#/components/schemas/createWorkspace" }
           }
       }
   }
   */
    controller.createRequest.bind(controller));
    secureRouter.get("/resource/:workspaceId", 
    /*
   #swagger.tags = ['Workspaces']
   #swagger.path =  '/workspaces/secure/resource/{workspaceId}'
   #swagger.security = [{ "bearerAuth": [] }]
   #swagger.description = 'get workspace by id'
   */
    controller.resourceRequest.bind(controller));
    secureRouter.get("/collection", 
    /*
   #swagger.tags = ['Workspaces']
   #swagger.path =  '/workspaces/secure/collection'
   #swagger.security = [{ "bearerAuth": [] }]
   #swagger.description = 'get workspace by user'
   */
    controller.collectionRequest.bind(controller));
    secureRouter.put("/:workspaceId", 
    /*
   #swagger.tags = ['Workspaces']
   #swagger.path =  '/workspaces/secure/{workspaceId}'
   #swagger.security = [{ "bearerAuth": [] }]
   #swagger.description = 'update workspace'
    #swagger.requestBody = {
       required: true,
       content: {
           "application/json": {
               schema: { $ref: "#/components/schemas/updateWorkspace" }
           }
       }
   }
   */
    controller.updateRequest.bind(controller));
    secureRouter.delete("/:workspaceId", 
    /*
    #swagger.tags = ['Workspaces']
    #swagger.path =  '/workspaces/secure/{workspaceId}'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.description = 'delete workspace by id'
    */
    controller.deleteRequest.bind(controller));
    // mounts //
    router.use("/secure", secureRouter);
    console.log("Workspaces router initialized.");
    return router;
};
exports.initializeWorkspacesRouter = initializeWorkspacesRouter;
