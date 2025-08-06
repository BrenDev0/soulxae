import { Request, Response } from "express";
import { AuthorizationError, BadRequestError, NotFoundError } from "../../../core/errors/errors";
import Container from "../../../core/dependencies/Container";
import GoogleService from "../GoogleService";
import HttpService from "../../../core/services/HttpService";
import { CalendarData } from "../../calendars/calendars.interface";


export default class GoogleCalendarController {
    private readonly block = "google.controller";
    private httpService: HttpService;
    private googleService: GoogleService; 
 
    constructor(httpService: HttpService , googleService: GoogleService) {
        this.httpService = httpService
        this.googleService = googleService
      
    }

    async checkAvailability(req: Request, res: Response): Promise<void> {
        const block = `${this.block}.checkAvailability`;
        try {
            const user = req.user;
            
            const calendarId = req.params.calendarId;
            this.httpService.requestValidation.validateUuid(calendarId, "calendarId", block);

            const requiredFields =  ["slot"];
            this.httpService.requestValidation.validateRequestBody(requiredFields, req.body, block);

            const calendarResource = await this.httpService.requestValidation.validateResource<CalendarData>(calendarId, "CalendarsService", "Calendar not found", block);
            
            const { slot } = req.body;
            const client = await this.googleService.clientManager.getcredentialedClient(user.user_id);

            const isAvailable = await this.googleService.calendarService.checkAvailability(client, calendarResource.calendarReferenceId, slot);

            res.status(200).json({ is_available: isAvailable });
        } catch (error) {
            throw error
        }
    }

    async getCalendars(req: Request, res: Response): Promise<void> {
        try {
            const user = req.user;
            const client = await this.googleService.clientManager.getcredentialedClient(user.user_id);

            const calendars = await this.googleService.calendarService.listCalendars(client);

            res.status(200).json({ data: calendars })
        } catch (error) {
            throw error 
        }
    }

    async getCalendarEvents(req: Request, res: Response): Promise<void> {
        const block = `${this.block}.getCalendarEvents`;
        try {
            const user = req.user;
            const calendarId = req.params.calendarId;
            const client = await this.googleService.clientManager.getcredentialedClient(user.user_id);

            this.httpService.requestValidation.validateUuid(calendarId, "calenderId", block);
       
            const resource = await this.httpService.requestValidation.validateResource<CalendarData>(calendarId, "CalendarsService", "Calendar not found", block);
            this.httpService.requestValidation.validateActionAuthorization(user.user_id, resource.userId, block);

            const data = await this.googleService.calendarService.listEvents(client, resource.calendarReferenceId);
            res.status(200).json({ data: data })
        } catch (error) {
            console.log(error)
            throw error;
        }
    } 

    async createEventRequest(req: Request, res: Response): Promise<void> {
        const block = `${this.block}.createEventRequest`
        try {
            const user = req.user;
            const calendarId = req.params.calendarId;
            const requiredFields = ["startTime", "endTime", "summary"];

            this.httpService.requestValidation.validateUuid(calendarId, "calendarId", block);
            this.httpService.requestValidation.validateRequestBody(requiredFields, req.body, block);
            
            const calendar = await this.httpService.requestValidation.validateResource<CalendarData>(calendarId, "CalendarsService", "Calendar not found", block);
        
            
            
            
            
            const client = await this.googleService.clientManager.getcredentialedClient(user.user_id);
            
            const calendarDetails = await this.googleService.calendarService.getCalendarDetails(client, calendar.calendarReferenceId);
            const timeZone = calendarDetails.timeZone
            
            // https://developers.google.com/workspace/calendar/api/v3/reference/events/insert  reference for parameters
            const event = {
                ...req.body,
                start: {
                    dateTime: req.body.startTime,
                    timeZone: timeZone
                },
                end: {
                    dateTime: req.body.endTime,
                    timeZone: timeZone
                },
                sendUpdates: "all"
            }

            await this.googleService.calendarService.addEvent(client, calendar.calendarReferenceId, event);

            res.status(200).json({ message: "Event added"})
        } catch (error) {
            throw error;
        }
    }

    // async updateEventRequest(req: Request, res: Response): Promise<void> {
    //     const block = `${this.block}.updateEventRequest`
    //     try {
    //         const user = req.user;
    //         const eventId = req.params.eventId;

    //         this.httpService.requestValidation.validateUuid(eventId, "eventId", block);

    //         const eventResource = await this.httpService.requestValidation.validateResource<EventData>(eventId, "EventsService", "Event not found", block);

    //         if(!eventResource.calendarReferenceId) {
    //             throw new GoogleError("Calendar configuration error", {
    //                 block: `${block}.calendarReferenceCheck`,
    //                 rescource: eventResource  
    //             });
    //         }

    //         const eventUpdates = {
    //             ...req.body,
    //             start: {
    //                 dateTime: req.body.startTime
    //             },
    //             end: {
    //                 dateTime: req.body.endTime
    //             },
    //             sendUpdates: "all"
    //         }

    //         const client = await this.googleService.clientManager.getcredentialedClient(businessId);

    //         await this.googleService.calendarService.updateEvent(client, eventResource.calendarReferenceId, eventResource.eventReferenceId, eventUpdates);

    //         res.status(200).json({ message: "Event deleted"})
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    // async deleteEventRequest(req: Request, res: Response): Promise<void> {
    //     const block =  `${this.block}.deleteEventRequest`;
    //     try {
    //         const user = req.user;
    //         const eventId = req.params.eventId;

    //         this.httpService.requestValidation.validateUuid(eventId, "eventId", block);

    //         const eventResource = await this.httpService.requestValidation.validateResource<EventData>(eventId, "EventsService", "Event not found", block);

    //         if(!eventResource.calendarReferenceId) {
    //             throw new GoogleError("Calendar configuration error", {
    //                 block: `${block}.calendarReferenceCheck`,
    //                 rescource: eventResource  
    //             });
    //         }

    //         if(!eventResource.calendarReferenceId) {
    //             throw new GoogleError("Calendar configuration error", {
    //                 block: `${block}.calendarReferenceCheck`,
    //                 rescource: eventResource  
    //             });
    //         }

    //         const client = await this.googleService.clientManager.getcredentialedClient();

    //         await this.googleService.calendarService.deleteEvent(client, eventResource.calendarReferenceId, eventResource.eventReferenceId);


    //         res.status(200).json({ message: "Event deleted"})
    //     } catch (error) {
    //         throw error;
    //     }
    // }
}

   