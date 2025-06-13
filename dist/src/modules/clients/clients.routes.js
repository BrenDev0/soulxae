"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeClientsRouter = void 0;
const express_1 = require("express");
const Container_1 = __importDefault(require("../../core/dependencies/Container"));
const initializeClientsRouter = (customController) => {
    const router = (0, express_1.Router)();
    const secureRouter = (0, express_1.Router)();
    const middlewareService = Container_1.default.resolve("MiddlewareService");
    const controller = customController !== null && customController !== void 0 ? customController : Container_1.default.resolve("ClientsController");
    secureRouter.use(middlewareService.auth.bind(middlewareService));
    // protected Routes //
    secureRouter.get("/resource/:clientId", 
    /*
   #swagger.tags = ['Clients']
   #swagger.path =  '/clients/secure/resource/{clientId}'
   #swagger.security = [{ "bearerAuth": [] }]
   #swagger.description = 'Get client by id'
  
   */
    controller.resourceRequest.bind(controller));
    secureRouter.get("/collection/:agentId", 
    /*
   #swagger.tags = ['Clients']
   #swagger.path =  '/clients/secure/collection/{agentId}'
   #swagger.security = [{ "bearerAuth": [] }]
   #swagger.description = 'Get agents clients'
   */
    controller.resourceRequest.bind(controller));
    secureRouter.delete("/:clientId", 
    /*
    #swagger.tags = ['Clients']
    #swagger.path =  '/clients/secure/{clientId}'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.description = 'delete client by id'
    */
    controller.deleteRequest.bind(controller));
    // mounts //
    router.use("/secure", secureRouter);
    console.log("Clients router initialized.");
    return router;
};
exports.initializeClientsRouter = initializeClientsRouter;
