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
const errors_1 = require("../../core/errors/errors");
const Container_1 = __importDefault(require("../../core/dependencies/Container"));
class EmployeesController {
    constructor(httpService, employeesService) {
        this.block = "employees.controller";
        this.httpService = httpService;
        this.employeesService = employeesService;
    }
    createRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const block = `${this.block}.createRequest`;
            try {
                const requiredFields = ["name", "email", "agentId"];
                this.httpService.requestValidation.validateRequestBody(requiredFields, req.body, block);
                const password = this.httpService.passwordService.generateRandomPassword(13);
                const userData = Object.assign(Object.assign({}, req.body), { password: this.httpService.encryptionService.encryptData(password) });
                const usersService = Container_1.default.resolve("UsersService");
                const newUser = yield usersService.create(userData);
                if (!newUser || !newUser.user_id) {
                    throw new errors_1.DatabaseError("Error creating employee");
                }
                const employeeData = {
                    userId: newUser.user_id,
                    agentId: req.body.agentId
                };
                yield this.employeesService.create(employeeData);
                res.status(200).json({ message: "Employee added" });
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
                const employeeId = req.params.employeeId;
                this.httpService.requestValidation.validateUuid(employeeId, "employeeId", block);
                const resource = yield this.employeesService.resource(employeeId);
                if (!resource) {
                    throw new errors_1.NotFoundError(undefined, {
                        block: `${block}.notFound`,
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
            const block = `${this.block}.collectionRequest`;
            try {
                const agentId = req.params.agentId;
                this.httpService.requestValidation.validateUuid(agentId, "agentId", block);
                const data = yield this.employeesService.collection(agentId);
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
                const employeeId = req.params.employeeId;
                this.httpService.requestValidation.validateUuid(employeeId, "employeeId", block);
                const resource = yield this.employeesService.resource(employeeId);
                if (!resource) {
                    throw new errors_1.NotFoundError(undefined, {
                        block: `${block}.notFound`,
                    });
                }
                const allowedChanges = ["name"];
                const filteredChanges = this.httpService.requestValidation.filterUpdateRequest(allowedChanges, req.body, block);
                yield this.employeesService.update(employeeId, filteredChanges);
                res.status(200).json({ message: "Employee updated" });
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
                const employeeId = req.params.employeeId;
                this.httpService.requestValidation.validateUuid(employeeId, "employeeId", block);
                const resource = yield this.employeesService.resource(employeeId);
                if (!resource) {
                    throw new errors_1.NotFoundError(undefined, {
                        block: `${block}.notFound`,
                    });
                }
                yield this.employeesService.delete(employeeId);
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = EmployeesController;
