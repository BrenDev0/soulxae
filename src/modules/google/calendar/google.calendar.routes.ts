import { Router } from 'express';
import Container from '../../../core/dependencies/Container';
import GoogleController from '../GoogleController';
import MiddlewareService from '../../../core/middleware/MiddlewareService';
import GoogleCalendarController from '../calendar/GoogleCalendarController';

export const initializeGoogleCalendarRouter = (customController?: GoogleController) => {
    const router = Router();
    const secureRouter = Router();
    const middlewareService = Container.resolve<MiddlewareService>("MiddlewareService");
    const controller = Container.resolve<GoogleCalendarController>("GoogleCalendarController");
    
    secureRouter.use(middlewareService.auth.bind(middlewareService));
    

    // calendar //

    secureRouter.get("/", 
        /*
        #swagger.tags = ['Google'] 
         #swagger.security = [{ "bearerAuth": [] }]
        #swagger.path = '/google/calendars/secure' 
        #swagger.description = 'get users calendars from drive'
        */
        controller.getCalendars.bind(controller)
    )
    

    // events //
    
    secureRouter.post("/events/:calendarId", 
        /*
        #swagger.tags = ['Google'] 
         #swagger.security = [{ "bearerAuth": [] }]
        #swagger.path = 'google/calendars/secure/events/{calendarId}' 
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
        controller.createEventRequest.bind(controller)
    )

 
    secureRouter.get("/availability",

        controller.checkAvailability.bind(controller)
    )


    secureRouter.get("/calendars/events/:calendarId", 
        /*
        #swagger.tags = ['Google'] 
         #swagger.security = [{ "bearerAuth": [] }]
        #swagger.path = '/google/secure/calendars/events/{calendarId}' 
        #swagger.description = 'get users calendars events'
        */
        controller.getCalendarEvents.bind(controller)
    )

    

    // mounts // 
    router.use("/secure", secureRouter);
    
    console.log("Google calendar router initialized.");
    return router;
}
