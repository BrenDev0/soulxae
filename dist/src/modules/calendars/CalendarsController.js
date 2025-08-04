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
class CalendarsController {
    constructor(httpService, calendarsService) {
        this.block = "calendars.controller";
        this.httpService = httpService;
        this.calendarsService = calendarsService;
    }
    createRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const block = `${this.block}.createRequest`;
            try {
                const user = req.user;
                const requiredFields = ["calendarReferenceId"];
                this.httpService.requestValidation.validateRequestBody(requiredFields, req.body, block);
                const calendarData = Object.assign(Object.assign({}, req.body), { userId: user.user_id });
                yield this.calendarsService.create(calendarData);
                res.status(200).json({ message: "Calendar added" });
            }
            catch (error) {
                throw error;
            }
        });
    }
    resourceRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const block = `${this.block}.resourceRequest`;
            try {
                const user = req.user;
                const calendarId = req.params.calendarId;
                this.httpService.requestValidation.validateUuid(calendarId, "CalendarId", block);
                const calendarResource = yield this.httpService.requestValidation.validateResource(calendarId, "CalendarsService", "Calendar not found", block);
                this.httpService.requestValidation.validateActionAuthorization(user.user_id, calendarResource.userId, block);
                res.status(200).json({ data: calendarResource });
            }
            catch (error) {
                throw error;
            }
        });
    }
    collectionRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const data = yield this.calendarsService.collection(user.user_id);
                res.status(200).json({ data: data });
            }
            catch (error) {
                throw error;
            }
        });
    }
    deleteRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const block = `${this.block}.deleteRequest`;
            try {
                const user = req.user;
                const calendarId = req.params.calendarId;
                this.httpService.requestValidation.validateUuid(calendarId, "CalendarId", block);
                const calendarResource = yield this.httpService.requestValidation.validateResource(calendarId, "CalendarsService", "Calendar not found", block);
                this.httpService.requestValidation.validateActionAuthorization(user.user_Id, calendarResource.userId, block);
                yield this.calendarsService.delete(calendarResource.calendarId);
                res.status(200).json({ message: "Calendar deleted" });
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = CalendarsController;
