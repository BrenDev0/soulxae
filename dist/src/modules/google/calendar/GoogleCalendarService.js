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
    findEvent(oauth2Client, calendarReferenceId, startTime, attendee) {
        return __awaiter(this, void 0, void 0, function* () {
            const block = `${this.block}.findEvent`;
            try {
                const datetime = new Date(startTime);
                const events = yield this.listEvents(oauth2Client, calendarReferenceId);
                const eventResource = events.find((event) => {
                    var _a;
                    if (!((_a = event.start) === null || _a === void 0 ? void 0 : _a.dateTime) || !event.attendees) {
                        return false;
                    }
                    const eventTimeLocal = event.start.dateTime.substring(0, 19);
                    const searchTimeLocal = startTime.substring(0, 19);
                    const timeMatches = eventTimeLocal === searchTimeLocal;
                    const attendeeMatches = event.attendees.some(att => att.email === attendee);
                    return timeMatches && attendeeMatches;
                });
                return eventResource || null;
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
    deleteEvent(oauth2Client, calendarReferenceId, eventReferenceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const block = `${this.block}.deleteEvent`;
            try {
                const calendar = googleapis_1.google.calendar({ version: 'v3', auth: oauth2Client });
                const response = calendar.events.delete({
                    calendarId: calendarReferenceId,
                    eventId: eventReferenceId
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
                const startTime = new Date(requestedDatetime);
                const endTime = new Date(startTime.getTime() + 30 * 60 * 1000);
                const utcStartTime = new Date(startTime.getTime() + (6 * 60 * 60 * 1000));
                const utcEndTime = new Date(endTime.getTime() + (6 * 60 * 60 * 1000));
                const requestBody = {
                    timeMin: utcStartTime.toISOString(),
                    timeMax: utcEndTime.toISOString(),
                    items: [{ id: calendarReferenceId }]
                };
                const response = yield calendar.freebusy.query({ requestBody });
                const busySlots = ((_b = (_a = response.data.calendars) === null || _a === void 0 ? void 0 : _a[calendarReferenceId]) === null || _b === void 0 ? void 0 : _b.busy) || [];
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
    findAvailableTimeSlots(oauth2Client_1, calendarReferenceId_1, startDate_1) {
        return __awaiter(this, arguments, void 0, function* (oauth2Client, calendarReferenceId, startDate, duration = 30, numberOfSlots = 3) {
            var _a, _b;
            const block = `${this.block}.findAvailableTimeSlots`;
            try {
                const calendar = googleapis_1.google.calendar({ version: 'v3', auth: oauth2Client });
                const availableSlots = [];
                const startTime = new Date(startDate);
                const endTime = new Date(startTime);
                endTime.setDate(endTime.getDate() + 7); // Check next 7 days
                // Convert to UTC for the query
                const utcStartTime = new Date(startTime.getTime() + (6 * 60 * 60 * 1000));
                const utcEndTime = new Date(endTime.getTime() + (6 * 60 * 60 * 1000));
                const requestBody = {
                    timeMin: utcStartTime.toISOString(),
                    timeMax: utcEndTime.toISOString(),
                    items: [{ id: calendarReferenceId }]
                };
                const response = yield calendar.freebusy.query({ requestBody });
                const busySlots = ((_b = (_a = response.data.calendars) === null || _a === void 0 ? void 0 : _a[calendarReferenceId]) === null || _b === void 0 ? void 0 : _b.busy) || [];
                const allSlots = this.generateTimeSlots(startTime, endTime, duration);
                for (const slot of allSlots) {
                    if (availableSlots.length >= numberOfSlots)
                        break;
                    const slotStart = new Date(slot);
                    const slotEnd = new Date(slotStart.getTime() + duration * 60 * 1000);
                    const isAvailable = !busySlots.some(busyPeriod => {
                        const busyStart = new Date(busyPeriod.start);
                        const busyEnd = new Date(busyPeriod.end);
                        return (slotStart < busyEnd && slotEnd > busyStart);
                    });
                    if (isAvailable) {
                        availableSlots.push(slot);
                    }
                }
                return availableSlots;
            }
            catch (error) {
                console.log(error, "ERROR::::::::::");
                throw new google_erros_1.GoogleError(undefined, {
                    block: block,
                    originalError: error.message
                });
            }
        });
    }
    generateTimeSlots(startDate, endDate, durationMinutes = 30) {
        const slots = [];
        const current = new Date(startDate);
        const now = new Date(); // Current time to filter out past slots
        const startHour = 9;
        const endHour = 17;
        while (current <= endDate) {
            // Skip weekends
            if (current.getDay() !== 0 && current.getDay() !== 6) {
                for (let hour = startHour; hour < endHour; hour++) {
                    for (let minute = 0; minute < 60; minute += durationMinutes) {
                        const slotTime = new Date(current);
                        slotTime.setHours(hour, minute, 0, 0);
                        const slotEndTime = new Date(slotTime.getTime() + durationMinutes * 60 * 1000);
                        // Check if slot is in the future and within business hours
                        const isInFuture = slotTime > now;
                        const isWithinBusinessHours = slotEndTime.getHours() < endHour ||
                            (slotEndTime.getHours() === endHour && slotEndTime.getMinutes() === 0);
                        if (isInFuture && isWithinBusinessHours) {
                            slots.push(slotTime.toISOString());
                        }
                    }
                }
            }
            // Move to next day
            current.setDate(current.getDate() + 1);
        }
        return slots;
    }
}
exports.default = GoogleCalendarService;
