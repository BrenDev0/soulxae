import { Router } from 'express';
import Container from '../../core/dependencies/Container';
import MiddlewareService from '../../core/middleware/MiddlewareService';
import CalendarsController from './CalendarsController';

export const initializeCalendarsRouter = (customController?: CalendarsController) => {
    const router = Router();
    const secureRouter = Router();
    const middlewareService = Container.resolve<MiddlewareService>("MiddlewareService");
    const controller = customController ?? Container.resolve<CalendarsController>("CalendarsController");

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
       controller.createRequest.bind(controller)
    )

    secureRouter.get("/resource/:calendarId",
        /*
        #swagger.tags = ['Calendars']
        #swagger.path =  '/calendars/secure/resource/{calendarId}'
        #swagger.security = [{ "bearerAuth": [] }] 
        #swagger.description = 'Get calendar by id'
        */

        controller.resourceRequest.bind(controller)
    )

    secureRouter.get("/collection",
        /*
        #swagger.tags = ['Calendars']
        #swagger.path =  '/calendars/secure/collection'
        #swagger.security = [{ "bearerAuth": [] }] 
        #swagger.description = 'get users calendars'
        */

        controller.collectionRequest.bind(controller)
    )

    secureRouter.delete("/:calendarId",
        /*
        #swagger.tags = ['Calendars']
        #swagger.path =  '/calendars/secure/{calendarId}'
        #swagger.security = [{ "bearerAuth": [] }] 
        #swagger.description = 'Update calendars'
        */
       controller.deleteRequest.bind(controller)
    )

  

    // mounts //

    router.use("/secure", secureRouter);

    console.log("Calendars router initialized.");
    return router;
}
