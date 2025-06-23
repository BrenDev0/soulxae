"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeMediaRouter = void 0;
const express_1 = require("express");
const Container_1 = __importDefault(require("../../core/dependencies/Container"));
const multer_1 = __importDefault(require("multer"));
const initializeMediaRouter = (customController) => {
    const router = (0, express_1.Router)();
    const secureRouter = (0, express_1.Router)();
    const storage = multer_1.default.memoryStorage();
    const upload = (0, multer_1.default)({ storage });
    const middlewareService = Container_1.default.resolve("MiddlewareService");
    const controller = customController !== null && customController !== void 0 ? customController : Container_1.default.resolve("MediaController");
    secureRouter.use(middlewareService.auth.bind(middlewareService));
    // protected Routes //
    secureRouter.post("/upload/files/:agentId", upload.single("file"), 
    /*
  #swagger.tags = ['Media']
  #swagger.path =  '/media/secure/upload/files/{agentId}'
  #swagger.security = [{ "bearerAuth": [] }]
  #swagger.description = 'Upload agent reference docs'
  #swagger.requestBody = {
      required: true,
      content: {
          "application/json": {
              schema: { $ref: "#/components/schemas/uploadAgentDocs" }
          }
      }
  }
  */
    controller.uploadReferenceDocs.bind(controller));
    // mounts //
    router.use("/secure", secureRouter);
    console.log("Media router initialized.");
    return router;
};
exports.initializeMediaRouter = initializeMediaRouter;
