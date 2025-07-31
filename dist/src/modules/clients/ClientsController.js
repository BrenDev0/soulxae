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
class ClientsController {
    constructor(httpService, clientsService) {
        this.block = "clients.controller";
        this.httpService = httpService;
        this.clientsService = clientsService;
    }
    // async createRequest(req: Request, res: Response): Promise<void> {
    //   const block = `${this.block}.createRequest`;
    //   try {
    //     const requiredFields = ["agentId", "name", "contactIdentifier"];
    //     this.httpService.requestValidation.validateRequestBody(requiredFields, req.body, block);
    //     const { agentId } = req.body;
    //     this.httpService.requestValidation.validateUuid(agentId, "agentId", block);
    //     await this.clientsService.create(req.body);
    //     res.status(200).json({ message: "Client added." });
    //   } catch (error) {
    //     throw error;
    //   }
    // }
    resourceRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const block = `${this.block}.resourceRequest`;
            try {
                const clientId = req.params.clientId;
                this.httpService.requestValidation.validateUuid(clientId, "clientId", block);
                const resource = yield this.httpService.requestValidation.validateResource(clientId, "ClientsService", "Client not found", block);
                res.status(200).json({ data: resource });
            }
            catch (error) {
                throw error;
            }
        });
    }
    collectionRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const block = `${this.block}.resourceRequest`;
            try {
                const agentId = req.params.agentId;
                this.httpService.requestValidation.validateUuid(agentId, "agentId", block);
                const data = yield this.clientsService.resource("agent_id", agentId);
                res.status(200).json({ data: data });
            }
            catch (error) {
                throw error;
            }
        });
    }
    // async updateRequest(req: Request, res: Response): Promise<void> {
    //   const block = `${this.block}.updateRequest`;
    //   try { 
    //    const resource = await this.clientsService.resource(user.user_id);
    //     if (!resource) {
    //       throw new NotFoundError(undefined, {
    //         block: `${block}.notFound`,
    //       });
    //     }
    //     const allowedChanges = [""];
    //     const filteredChanges = this.htttpService.requestValidation.filterUpdateRequest<ClientsData>(allowedChanges, req.body, block);
    //     await this.clientsService.update(filteredChanges);
    //     res.status(200).json({ message: "updated" });
    //   } catch (error) {
    //     throw error;
    //   }
    // }
    deleteRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const block = `${this.block}.deleteRequest`;
            try {
                const clientId = req.params.clientId;
                this.httpService.requestValidation.validateUuid(clientId, "clientId", block);
                const resource = yield this.httpService.requestValidation.validateResource(clientId, "ClientsService", "Client not found", block);
                yield this.clientsService.delete(clientId);
                res.status(200).json({ message: "Client deleted" });
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = ClientsController;
