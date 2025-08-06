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
const googleapis_1 = require("googleapis");
const google_erros_1 = require("../google.erros");
class GoogleCalendarService {
    constructor() {
        this.block = "google.services.calendar";
    }
    listCalendars(oauth2Client) {
        return __awaiter(this, void 0, void 0, function* () {
            const calendar = googleapis_1.google.calendar({ version: 'v3', auth: oauth2Client });
            const res = yield calendar.calendarList.list();
            const calendars = res.data.items;
            if (!calendars || calendars.length === 0) {
                throw new errors_1.NotFoundError("no calendars found in google drive");
            }
            return calendars.filter((calendar) => calendar.accessRole === 'owner');
        });
    }
    getCalendarDetails(oauth2Client, calendarReferenceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const block = `${this.block}.getCalendarDetails`;
            try {
                const calendar = googleapis_1.google.calendar({ version: 'v3', auth: oauth2Client });
                const calendarDetails = yield calendar.calendars.get({
                    calendarId: calendarReferenceId
                });
                return calendarDetails.data;
            }
            catch (error) {
                throw new google_erros_1.GoogleError(undefined, {
                    block: block,
                    originalError: error.message
                });
            }
        });
    }
    // events //
    listEvents(oauth2Client, calendarReferenceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const block = `${this.block}.listEvents`;
            try {
                const calendar = googleapis_1.google.calendar({ version: 'v3', auth: oauth2Client });
                const res = yield calendar.events.list({
                    calendarId: calendarReferenceId
                });
                const events = res.data.items;
                return events || [];
            }
            catch (error) {
                throw new google_erros_1.GoogleError(undefined, {
                    block: block,
                    originalError: error.message
                });
            }
        });
    }
    addEvent(oauth2Client, calendarReferenceId, event) {
        return __awaiter(this, void 0, void 0, function* () {
            const block = `${this.block}.addEvent`;
            try {
                const calendar = googleapis_1.google.calendar({ version: 'v3', auth: oauth2Client });
                const response = yield calendar.events.insert({
                    calendarId: calendarReferenceId,
                    requestBody: event
                });
                return;
            }
            catch (error) {
                throw new google_erros_1.GoogleError(undefined, {
                    block: block,
                    originalError: error.message
                });
            }
        });
    }
    updateEvent(oauth2Client, calendarReferenceId, eventReferenceId, eventUpdates) {
        return __awaiter(this, void 0, void 0, function* () {
            const block = `${this.block}.updateEvent`;
            try {
                const calendar = googleapis_1.google.calendar({ version: 'v3', auth: oauth2Client });
                const response = calendar.events.patch({
                    calendarId: calendarReferenceId,
                    eventId: eventReferenceId,
                    requestBody: eventUpdates
                });
                return;
            }
            catch (error) {
                throw new google_erros_1.GoogleError(undefined, {
                    block: block,
                    originalError: error.message
                });
            }
        });
    }
    deleteEvent(oauth2Client, calendarReferenceId, eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            const block = `${this.block}.deleteEvent`;
            try {
                const calendar = googleapis_1.google.calendar({ version: 'v3', auth: oauth2Client });
                const response = calendar.events.delete({
                    calendarId: calendarReferenceId,
                    eventId: eventId
                });
                return;
            }
            catch (error) {
                throw new google_erros_1.GoogleError(undefined, {
                    block: block,
                    originalError: error.message
                });
            }
        });
    }
    checkAvailability(oauth2Client, calendarReferenceId, requestedDatetime) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const block = `${this.block}.checkAvailibility`;
            try {
                const calendar = googleapis_1.google.calendar({ version: 'v3', auth: oauth2Client });
                const calendarDetails = yield this.getCalendarDetails(oauth2Client, calendarReferenceId);
                const calendarTimeZone = calendarDetails.timeZone;
                const startTime = new Date(requestedDatetime);
                const endTime = new Date(startTime.getTime() + 30 * 60 * 1000);
                const utcStartTime = new Date(startTime.getTime() + (6 * 60 * 60 * 1000));
                const utcEndTime = new Date(endTime.getTime() + (6 * 60 * 60 * 1000));
                const requestBody = {
                    timeMin: utcStartTime.toISOString(),
                    timeMax: utcEndTime.toISOString(),
                    timeZone: calendarTimeZone,
                    items: [{ id: calendarReferenceId }]
                };
                const response = yield calendar.freebusy.query({ requestBody });
                console.log(response.data, "RES::::::::::::");
                const busySlots = ((_b = (_a = response.data.calendars) === null || _a === void 0 ? void 0 : _a[calendarReferenceId]) === null || _b === void 0 ? void 0 : _b.busy) || [];
                console.log(busySlots, "SLOTs::::::::::::::");
                return busySlots.length === 0;
            }
            catch (error) {
                throw new google_erros_1.GoogleError(undefined, {
                    block: block,
                    originalError: error.message
                });
            }
        });
    }
}
exports.default = GoogleCalendarService;
