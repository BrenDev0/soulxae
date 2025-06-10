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
const errors_1 = require("../../core/errors/errors");
class WorkspacesController {
    constructor(httpService, workspacesService) {
        this.block = "workspaces.controller";
        this.workspacesService = workspacesService;
        this.httpService = httpService;
    }
    createRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const block = `${this.block}.createRequest`;
            try {
                const user = req.user;
                const requiredFields = ["name"];
                this.httpService.requestValidation.validateRequestBody(requiredFields, req.body, block);
                const workspaceData = Object.assign(Object.assign({}, req.body), { userId: user.user_id });
                yield this.workspacesService.create(workspaceData);
                res.status(200).json({ message: "Workspace added." });
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
                const workspaceId = req.params.workspaceId;
                this.httpService.requestValidation.validateUuid(workspaceId, "workspaceId", block);
                const resource = yield this.workspacesService.resource(workspaceId);
                if (!resource) {
                    throw new errors_1.NotFoundError(undefined, {
                        block: `${block}.resouceCheck`,
                        resource: resource || `No workspace found in de with id: ${workspaceId}`
                    });
                }
                if (resource.userId !== user.user_id) {
                    throw new errors_1.AuthorizationError(undefined, {
                        block: `${block}.userCheck`,
                        resourceUserId: resource.userId,
                        user: user.user_id
                    });
                }
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
                const user = req.user;
                const data = yield this.workspacesService.collection(user.user_id);
                res.status(200).json({ data: data });
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const block = `${this.block}.updateRequest`;
            try {
                const user = req.user;
                const workspaceId = req.params.workspaceId;
                this.httpService.requestValidation.validateUuid(workspaceId, "workspaceId", block);
                const resource = yield this.workspacesService.resource(workspaceId);
                if (!resource) {
                    throw new errors_1.NotFoundError(undefined, {
                        block: `${block}.notFound`,
                    });
                }
                if (resource.userId !== user.user_id) {
                    throw new errors_1.AuthorizationError(undefined, {
                        block: `${block}.userCheck`,
                        resourceUserId: resource.userId,
                        user: user.user_id
                    });
                }
                const allowedChanges = ["name"];
                const filteredChanges = this.httpService.requestValidation.filterUpdateRequest(allowedChanges, req.body, block);
                yield this.workspacesService.update(workspaceId, filteredChanges);
                res.status(200).json({ message: "workspace updated" });
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
                const workspaceId = req.params.workspaceId;
                this.httpService.requestValidation.validateUuid(workspaceId, "workspaceId", block);
                const resource = yield this.workspacesService.resource(workspaceId);
                if (!resource) {
                    throw new errors_1.NotFoundError(undefined, {
                        block: `${block}.notFound`,
                    });
                }
                if (resource.userId !== user.user_id) {
                    throw new errors_1.AuthorizationError(undefined, {
                        block: `${block}.userCheck`,
                        resourceUserId: resource.userId,
                        user: user.user_id
                    });
                }
                yield this.workspacesService.delete(workspaceId);
                res.status(200).json({ message: "Workspace deleted" });
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = WorkspacesController;
