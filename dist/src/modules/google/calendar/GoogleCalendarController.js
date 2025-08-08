"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../../../core/errors/errors");
class GoogleCalendarController {
    constructor(httpService, googleService) {
        this.block = "google.controller";
        this.httpService = httpService;
        this.googleService = googleService;
    }
    checkAvailability(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const block = `${this.block}.checkAvailability`;
            try {
                const user = req.user;
                const calendarId = req.params.calendarId;
                this.httpService.requestValidation.validateUuid(calendarId, "calendarId", block);
                const requiredFields = ["slot"];
                this.httpService.requestValidation.validateRequestBody(requiredFields, req.body, block);
                const calendarResource = yield this.httpService.requestValidation.validateResource(calendarId, "CalendarsService", "Calendar not found", block);
                const { slot } = req.body;
                const client = yield this.googleService.clientManager.getcredentialedClient(user.user_id);
                const isAvailable = yield this.googleService.calendarService.checkAvailability(client, calendarResource.calendarReferenceId, slot);
                res.status(200).json({ is_available: isAvailable });
            }
            catch (error) {
                throw error;
            }
        });
    }
    getCalendars(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const client = yield this.googleService.clientManager.getcredentialedClient(user.user_id);
                const calendars = yield this.googleService.calendarService.listCalendars(client);
                res.status(200).json({ data: calendars });
            }
            catch (error) {
                throw error;
            }
        });
    }
    getCalendarEvents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const block = `${this.block}.getCalendarEvents`;
            try {
                const user = req.user;
                const calendarId = req.params.calendarId;
                const client = yield this.googleService.clientManager.getcredentialedClient(user.user_id);
                this.httpService.requestValidation.validateUuid(calendarId, "calenderId", block);
                const resource = yield this.httpService.requestValidation.validateResource(calendarId, "CalendarsService", "Calendar not found", block);
                this.httpService.requestValidation.validateActionAuthorization(user.user_id, resource.userId, block);
                const data = yield this.googleService.calendarService.listEvents(client, resource.calendarReferenceId);
                res.status(200).json({ data: data });
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    createEventRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const block = `${this.block}.createEventRequest`;
            try {
                const user = req.user;
                const calendarId = req.params.calendarId;
                const requiredFields = ["startTime", "endTime", "summary"];
                this.httpService.requestValidation.validateUuid(calendarId, "calendarId", block);
                this.httpService.requestValidation.validateRequestBody(requiredFields, req.body, block);
                const calendar = yield this.httpService.requestValidation.validateResource(calendarId, "CalendarsService", "Calendar not found", block);
                const client = yield this.googleService.clientManager.getcredentialedClient(user.user_id);
                const calendarDetails = yield this.googleService.calendarService.getCalendarDetails(client, calendar.calendarReferenceId);
                const timeZone = calendarDetails.timeZone;
                // https://developers.google.com/workspace/calendar/api/v3/reference/events/insert  reference for parameters
                const event = Object.assign(Object.assign({}, req.body), { start: {
                        dateTime: req.body.startTime,
                        timeZone: timeZone
                    }, end: {
                        dateTime: req.body.endTime,
                        timeZone: timeZone
                    }, sendUpdates: "all" });
                yield this.googleService.calendarService.addEvent(client, calendar.calendarReferenceId, event);
                res.status(200).json({ message: "Event added" });
            }
            catch (error) {
                throw error;
            }
        });
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
    deleteEventRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const block = `${this.block}.deleteEventRequest`;
            try {
                const user = req.user;
                const { startTime, attendee } = req.query;
                if (!startTime || !attendee) {
                    throw new errors_1.BadRequestError(undefined);
                }
                ;
                const calendarId = req.params.calendarId;
                this.httpService.requestValidation.validateUuid(calendarId, "calendarId", block);
                const calendarResource = yield this.httpService.requestValidation.validateResource(calendarId, "CalendarsService", "Calendar not found", block);
                this.httpService.requestValidation.validateActionAuthorization(user.user_id, calendarResource.userId, block);
                const client = yield this.googleService.clientManager.getcredentialedClient(user.user_id);
                const eventResource = yield this.googleService.calendarService.findEvent(client, calendarResource.calendarReferenceId, startTime, attendee);
                if (!eventResource || !eventResource.id) {
                    res.status(404).json({ message: "Event not found" });
                    return;
                }
                yield this.googleService.calendarService.deleteEvent(client, calendarResource.calendarReferenceId, eventResource.id);
                res.status(200).json({ message: "Event deleted" });
            }
            catch (error) {
                throw error;
            }
        });
    }
    getAvailableTimeSlots(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const block = `${this.block}.getAvailableTimeSlots`;
            try {
                const user = req.user;
                const { startTime } = req.query;
                const calendarId = req.params.calendarId;
                this.httpService.requestValidation.validateUuid(calendarId, "calendarId", block);
                const calendarResource = yield this.httpService.requestValidation.validateResource(calendarId, "CalendarsService", "Calendar not found", block);
                this.httpService.requestValidation.validateActionAuthorization(user.user_id, calendarResource.userId, block);
                const client = yield this.googleService.clientManager.getcredentialedClient(user.user_id);
                const data = yield this.googleService.calendarService.findAvailableTimeSlots(client, calendarResource.calendarReferenceId, startTime);
                res.status(200).json({ data });
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = GoogleCalendarController;
