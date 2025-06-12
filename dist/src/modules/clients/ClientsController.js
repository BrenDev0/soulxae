"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ClientsController {
    constructor(httpService, clientsService) {
        this.block = "clients.controller";
        this.httpService = httpService;
        this.clientsService = clientsService;
    }
}
exports.default = ClientsController;
