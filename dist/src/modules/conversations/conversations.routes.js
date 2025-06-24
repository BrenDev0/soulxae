"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeConversationsRouter = void 0;
const express_1 = require("express");
const Container_1 = __importDefault(require("../../core/dependencies/Container"));
const initializeConversationsRouter = (customController) => {
    const router = (0, express_1.Router)();
    const secureRouter = (0, express_1.Router)();
    const middlewareService = Container_1.default.resolve("MiddlewareService");
    const controller = customController !== null && customController !== void 0 ? customController : Container_1.default.resolve("ConversationsController");
    secureRouter.use(middlewareService.auth.bind(middlewareService));
    // protected Routes //
    secureRouter.get("/resource/:conversationId", 
    /*
   #swagger.tags = ['Conversations']
   #swagger.path =  '/conversations/secure/resource/{conversationId}'
   #swagger.security = [{ "bearerAuth": [] }]
   #swagger.description = 'get conversation by id'
   */
    controller.resourceRequest.bind(controller));
    secureRouter.get("/collection/:agentId", 
    /*
   #swagger.tags = ['Conversations']
   #swagger.path =  '/conversations/secure/collection/{agentId}'
   #swagger.security = [{ "bearerAuth": [] }]
   #swagger.description = 'get agents conversations'
   */
    controller.collectionRequest.bind(controller));
    secureRouter.put("/:conversationId/agent-handoff", controller.agentHandoff.bind(controller));
    secureRouter.delete("/:conversationId", 
    /*
   #swagger.tags = ['Conversations']
   #swagger.path =  '/conversations/secure/{conversationId}'
   #swagger.security = [{ "bearerAuth": [] }]
   #swagger.description = 'delete converation by id'
   */
    controller.deleteRequest.bind(controller));
    // mounts //
    router.use("/secure", secureRouter);
    console.log("Conversations router initialized.");
    return router;
};
exports.initializeConversationsRouter = initializeConversationsRouter;
