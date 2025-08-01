"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeCalendarsRouter = void 0;
const express_1 = require("express");
const Container_1 = __importDefault(require("../../core/dependencies/Container"));
const initializeCalendarsRouter = (customController) => {
    const router = (0, express_1.Router)();
    const secureRouter = (0, express_1.Router)();
    const middlewareService = Container_1.default.resolve("MiddlewareService");
    const controller = customController !== null && customController !== void 0 ? customController : Container_1.default.resolve("CalendarsController");
    secureRouter.use(middlewareService.auth.bind(middlewareService));
    // protected Routes //
    secureRouter.post("/create", 
    /*
    #swagger.tags = ['Calendars']
    #swagger.path =  '/calendars/secure/create'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.description = 'create calendar'
    #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/createCalendar" }
            }
        }
    }
    */
    controller.createRequest.bind(controller));
    secureRouter.get("/resource/:calendarId", 
    /*
    #swagger.tags = ['Calendars']
    #swagger.path =  '/calendars/secure/resource/{calendarId}'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.description = 'Get calendar by id'
    */
    controller.resourceRequest.bind(controller));
    secureRouter.get("/collection", 
    /*
    #swagger.tags = ['Calendars']
    #swagger.path =  '/calendars/secure/collection'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.description = 'get users calendars'
    */
    controller.collectionRequest.bind(controller));
    secureRouter.delete("/:calendarId", 
    /*
    #swagger.tags = ['Calendars']
    #swagger.path =  '/calendars/secure/{calendarId}'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.description = 'Update calendars'
    */
    controller.deleteRequest.bind(controller));
    // mounts //
    router.use("/secure", secureRouter);
    console.log("Calendars router initialized.");
    return router;
};
exports.initializeCalendarsRouter = initializeCalendarsRouter;
