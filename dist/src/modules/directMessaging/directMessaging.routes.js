"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDirectMessageingRouter = void 0;
const express_1 = require("express");
const Container_1 = __importDefault(require("../../core/dependencies/Container"));
const initializeDirectMessageingRouter = (customController) => {
    const router = (0, express_1.Router)();
    const secureRouter = (0, express_1.Router)();
    const middlewareService = Container_1.default.resolve("MiddlewareService");
    const controller = customController !== null && customController !== void 0 ? customController : Container_1.default.resolve("DirectMessagingController");
    secureRouter.use(middlewareService.auth.bind(middlewareService));
    // protected Routes //
    secureRouter.post("/send", controller.send.bind(controller));
    // unprotected Routes //
    router.post("/:id/webhook", controller.handleIncommingMessage.bind(controller));
    router.get('/:id/webhook', controller.verifyWebhook.bind(controller));
    // mounts //
    router.use("/secure", secureRouter);
    console.log("Direct Messaging router initialized.");
    return router;
};
exports.initializeDirectMessageingRouter = initializeDirectMessageingRouter;
