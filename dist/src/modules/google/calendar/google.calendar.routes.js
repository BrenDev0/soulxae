"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeGoogleCalendarRouter = void 0;
const express_1 = require("express");
const Container_1 = __importDefault(require("../../../core/dependencies/Container"));
const initializeGoogleCalendarRouter = (customController) => {
    const router = (0, express_1.Router)();
    const secureRouter = (0, express_1.Router)();
    const middlewareService = Container_1.default.resolve("MiddlewareService");
    const controller = Container_1.default.resolve("GoogleCalendarController");
    secureRouter.use(middlewareService.auth.bind(middlewareService));
    // calendar //
    secureRouter.get("/", 
    /*
    #swagger.tags = ['Google']
     #swagger.security = [{ "bearerAuth": [] }]
    #swagger.path = '/google/calendars/secure'
    #swagger.description = 'get users calendars from drive'
    */
    controller.getCalendars.bind(controller));
    // events //
    secureRouter.post("/events/:calendarId", 
    /*
    #swagger.tags = ['Google']
     #swagger.security = [{ "bearerAuth": [] }]
    #swagger.path = '/calendars/secure/events/{calendarId}'
    #swagger.description = 'create event for full list of parameters check: https://developers.google.com/workspace/calendar/api/v3/reference/events/insert for parameters'
    #swagger.requestBody = {
        required: true,
        content: {
            "application/json": {
                schema: { $ref: "#/components/schemas/createEvent" }
            }
        }
    }
    */
    controller.createEventRequest.bind(controller));
    secureRouter.get("/availability", controller.checkAvailability.bind(controller));
    // secureRouter.get("/calendars/events/:calendarId", 
    //     /*
    //     #swagger.tags = ['Google'] 
    //      #swagger.security = [{ "bearerAuth": [] }]
    //     #swagger.path = '/google/secure/calendars/events/{calendarId}' 
    //     #swagger.description = 'get users calendars events'
    //     */
    //     controller.getCalendarEvents.bind(controller)
    // )
    // mounts // 
    router.use("/secure", secureRouter);
    console.log("Google calendar router initialized.");
    return router;
};
exports.initializeGoogleCalendarRouter = initializeGoogleCalendarRouter;
