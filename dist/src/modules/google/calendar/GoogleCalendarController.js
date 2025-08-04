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
class GoogleCalendarController {
    constructor(httpService, googleService) {
        this.block = "google.controller";
        this.httpService = httpService;
        this.googleService = googleService;
    }
    checkAvailability(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.status(200).json({ is_available: false });
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
                const data = yield this.googleService.calendarService.listEvents(client, resource.calendarReferenceId);
                res.status(200).json({ data: data });
            }
            catch (error) {
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
                // https://developers.google.com/workspace/calendar/api/v3/reference/events/insert  reference for parameters
                const event = Object.assign(Object.assign({}, req.body), { start: {
                        dateTime: req.body.startTime
                    }, end: {
                        dateTime: req.body.endTime
                    }, sendUpdates: "all" });
                const client = yield this.googleService.clientManager.getcredentialedClient(user.user_id);
                yield this.googleService.calendarService.addEvent(client, calendar.calendarReferenceId, event);
                res.status(200).json({ message: "Event added" });
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = GoogleCalendarController;
