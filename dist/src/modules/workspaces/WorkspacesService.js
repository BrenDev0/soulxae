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
class WorkspaceService {
    constructor(repository) {
        this.block = "workspaces.service";
        this.repository = repository;
    }
    create(workspaces) {
        return __awaiter(this, void 0, void 0, function* () {
            const mappedWorkspace = this.mapToDb(workspaces);
            try {
                return this.repository.create(mappedWorkspace);
            }
            catch (error) {
                (0, error_service_1.handleServiceError)(error, this.block, "create", mappedWorkspace);
                throw error;
            }
        });
    }
    resource(workspaceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.repository.selectOne("workspace_id", workspaceId);
                if (!result) {
                    return null;
                }
                return this.mapFromDb(result);
            }
            catch (error) {
                (0, error_service_1.handleServiceError)(error, this.block, "resource", { workspaceId });
                throw error;
            }
        });
    }
    collection(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.repository.select("user_id", userId);
                const data = result.map((workspace) => this.mapFromDb(workspace));
                return data;
            }
            catch (error) {
                (0, error_service_1.handleServiceError)(error, this.block, "collection", { userId });
                throw error;
            }
        });
    }
    update(workspaceId, changes) {
        return __awaiter(this, void 0, void 0, function* () {
            const mappedChanges = this.mapToDb(changes);
            const cleanedChanges = Object.fromEntries(Object.entries(mappedChanges).filter(([_, value]) => value !== undefined));
            try {
                return yield this.repository.update("workspace_id", workspaceId, cleanedChanges);
            }
            catch (error) {
                (0, error_service_1.handleServiceError)(error, this.block, "update", cleanedChanges);
                throw error;
            }
        });
    }
    delete(workspaceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repository.delete("workspace_id", workspaceId);
            }
            catch (error) {
                (0, error_service_1.handleServiceError)(error, this.block, "delete", { workspaceId });
                throw error;
            }
        });
    }
    mapToDb(workspace) {
        const encryptionService = Container_1.default.resolve("EncryptionService");
        return {
            user_id: workspace.userId,
            name: workspace.name
        };
    }
    mapFromDb(workspace) {
        const encryptionService = Container_1.default.resolve("EncryptionService");
        return {
            workspaceId: workspace.workspace_id,
            userId: workspace.user_id,
            name: workspace.name
        };
    }
}
exports.default = WorkspaceService;
