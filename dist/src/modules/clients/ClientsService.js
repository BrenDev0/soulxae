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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_service_1 = require("../../core/errors/error.service");
const Container_1 = __importDefault(require("../../core/dependencies/Container"));
class ClientsService {
    constructor(repository) {
        this.block = "clients.service";
        this.repository = repository;
    }
    create(clients) {
        return __awaiter(this, void 0, void 0, function* () {
            const mappedClient = this.mapToDb(clients);
            try {
                return this.repository.create(mappedClient);
            }
            catch (error) {
                (0, error_service_1.handleServiceError)(error, this.block, "create", mappedClient);
                throw error;
            }
        });
    }
    resource(whereCol, identifier) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.repository.selectOne(whereCol, identifier);
                if (!result) {
                    return null;
                }
                return this.mapFromDb(result);
            }
            catch (error) {
                (0, error_service_1.handleServiceError)(error, this.block, "resource", { whereCol, identifier });
                throw error;
            }
        });
    }
    update(clientId, changes) {
        return __awaiter(this, void 0, void 0, function* () {
            const mappedChanges = this.mapToDb(changes);
            const cleanedChanges = Object.fromEntries(Object.entries(mappedChanges).filter(([_, value]) => value !== undefined));
            try {
                return yield this.repository.update("clientId", clientId, cleanedChanges);
            }
            catch (error) {
                (0, error_service_1.handleServiceError)(error, this.block, "update", cleanedChanges);
                throw error;
            }
        });
    }
    delete(clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repository.delete("client_id", clientId);
            }
            catch (error) {
                (0, error_service_1.handleServiceError)(error, this.block, "delete", { clientId });
                throw error;
            }
        });
    }
    mapToDb(client) {
        const encryptionService = Container_1.default.resolve("EncryptionService");
        return {
            agent_id: client.agentId,
            name: client.name && encryptionService.encryptData(client.name),
            contact_identifier: client.contactIdentifier && encryptionService.encryptData(client.contactIdentifier)
        };
    }
    mapFromDb(client) {
        const encryptionService = Container_1.default.resolve("EncryptionService");
        return {
            clientId: client.client_id,
            agentId: client.agent_id,
            name: client.name === null ? null : encryptionService.decryptData(client.name),
            contactIdentifier: encryptionService.decryptData(client.contact_identifier)
        };
    }
}
exports.default = ClientsService;
