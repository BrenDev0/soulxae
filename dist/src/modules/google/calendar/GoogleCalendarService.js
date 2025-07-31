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
}
exports.default = GoogleCalendarService;
