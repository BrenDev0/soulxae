"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializePlatformsRouter = void 0;
const express_1 = require("express");
const Container_1 = __importDefault(require("../../core/dependencies/Container"));
const initializePlatformsRouter = (customController) => {
    const router = (0, express_1.Router)();
    const secureRouter = (0, express_1.Router)();
    const middlewareService = Container_1.default.resolve("MiddlewareService");
    const controller = customController !== null && customController !== void 0 ? customController : Container_1.default.resolve("PlatformsController");
    secureRouter.use(middlewareService.auth.bind(middlewareService));
    // protected Routes //
    secureRouter.post("/create", 
    /*
    #swagger.tags = ['Platforms']
    #swagger.path =  '/platforms/secure/create'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.description = 'Update platforms'
    #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/createPlatform" }
            }
        }
    }
    */
    controller.createRequest.bind(controller));
    secureRouter.get("/resource/:platformId", 
    /*
    #swagger.tags = ['Platforms']
    #swagger.path =  '/platforms/secure/resource/{platformId}'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.description = 'get platform by id'
    */
    controller.resourceRequest.bind(controller));
    secureRouter.get("/collection/:agentId", 
    /*
    #swagger.tags = ['Platforms']
    #swagger.path =  '/platforms/secure/collection/{agentId}'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.description = 'get agents platforms'
    */
    controller.collectionRequest.bind(controller));
    secureRouter.put("/:platformId", 
    /*
    #swagger.tags = ['Platforms']
    #swagger.path =  '/platforms/secure/{platformId}'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.description = 'Update platform'
    #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/updatePlatform" }
            }
        }
    }
    */
    controller.updateRequest.bind(controller));
    secureRouter.delete("/:platformId", 
    /*
    #swagger.tags = ['Platforms']
    #swagger.path =  '/platforms/secure/{platformId}'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.description = 'delete platform by id'
    */
    controller.deleteRequest.bind(controller));
    // mounts //
    router.use("/secure", secureRouter);
    console.log("Platforms router initialized.");
    return router;
};
exports.initializePlatformsRouter = initializePlatformsRouter;
