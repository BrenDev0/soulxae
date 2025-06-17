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
class EmployeesService {
    constructor(repository) {
        this.block = "employees.service";
        this.repository = repository;
    }
    create(employees) {
        return __awaiter(this, void 0, void 0, function* () {
            const mappedEmployee = this.mapToDb(employees);
            try {
                return this.repository.create(mappedEmployee);
            }
            catch (error) {
                (0, error_service_1.handleServiceError)(error, this.block, "create", mappedEmployee);
                throw error;
            }
        });
    }
    resource(employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.repository.selectOne("employee_id", employeeId);
                if (!result) {
                    return null;
                }
                return this.mapFromDb(result);
            }
            catch (error) {
                (0, error_service_1.handleServiceError)(error, this.block, "resource", { employeeId });
                throw error;
            }
        });
    }
    collection(agentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.repository.select("agent_id", agentId);
                return result.map((employee) => this.mapFromDb(employee));
            }
            catch (error) {
                (0, error_service_1.handleServiceError)(error, this.block, "collection", { agentId });
                throw error;
            }
        });
    }
    update(employeeId, changes) {
        return __awaiter(this, void 0, void 0, function* () {
            const mappedChanges = this.mapToDb(changes);
            const cleanedChanges = Object.fromEntries(Object.entries(mappedChanges).filter(([_, value]) => value !== undefined));
            try {
                return yield this.repository.update("employee_id", employeeId, cleanedChanges);
            }
            catch (error) {
                (0, error_service_1.handleServiceError)(error, this.block, "update", cleanedChanges);
                throw error;
            }
        });
    }
    delete(employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repository.delete("employee_id", employeeId);
            }
            catch (error) {
                (0, error_service_1.handleServiceError)(error, this.block, "delete", { employeeId });
                throw error;
            }
        });
    }
    mapToDb(employee) {
        const encryptionService = Container_1.default.resolve("EncryptionService");
        return {
            agent_id: employee.agentId,
            user_id: employee.userId
        };
    }
    mapFromDb(employee) {
        const encryptionService = Container_1.default.resolve("EncryptionService");
        return {
            employeeId: employee.employee_id,
            agentId: employee.agent_id,
            userId: employee.user_id,
            name: employee.name && encryptionService.decryptData(employee.name),
            email: employee.email && encryptionService.decryptData(employee.email),
            password: employee.password && encryptionService.decryptData(employee.password)
        };
    }
}
exports.default = EmployeesService;
