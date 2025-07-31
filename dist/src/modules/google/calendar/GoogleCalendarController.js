"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GoogleCalendarController {
    constructor(httpService, googleService) {
        this.block = "google.controller";
        this.httpService = httpService;
        this.googleService = googleService;
    }
}
exports.default = GoogleCalendarController;
