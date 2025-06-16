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
class AgenciesService {
    constructor(repository) {
        this.block = "agencies.service";
        this.repository = repository;
    }
    create(agency) {
        return __awaiter(this, void 0, void 0, function* () {
            const mappedAgency = this.mapToDb(agency);
            try {
                return this.repository.create(mappedAgency);
            }
            catch (error) {
                (0, error_service_1.handleServiceError)(error, this.block, "create", mappedAgency);
                throw error;
            }
        });
    }
    resource(agencyId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.repository.selectOne("agencyId", agencyId);
                if (!result) {
                    return null;
                }
                return this.mapFromDb(result);
            }
            catch (error) {
                (0, error_service_1.handleServiceError)(error, this.block, "resource", { agencyId });
                throw error;
            }
        });
    }
    collection(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.repository.select("user_id", userId);
                return result.map((agency) => this.mapFromDb(agency));
            }
            catch (error) {
                (0, error_service_1.handleServiceError)(error, this.block, "resource", { userId });
                throw error;
            }
        });
    }
    update(agencyId, changes) {
        return __awaiter(this, void 0, void 0, function* () {
            const mappedChanges = this.mapToDb(changes);
            const cleanedChanges = Object.fromEntries(Object.entries(mappedChanges).filter(([_, value]) => value !== undefined));
            try {
                return yield this.repository.update("agentcy_id", agencyId, cleanedChanges);
            }
            catch (error) {
                (0, error_service_1.handleServiceError)(error, this.block, "update", cleanedChanges);
                throw error;
            }
        });
    }
    delete(agencyId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repository.delete("agency_id", agencyId);
            }
            catch (error) {
                (0, error_service_1.handleServiceError)(error, this.block, "delete", { agencyId });
                throw error;
            }
        });
    }
    mapToDb(agency) {
        const encryptionService = Container_1.default.resolve("EncryptionService");
        return {
            user_id: agency.userId,
            name: agency.name,
            branding: agency.branding,
            email: agency.email,
            login_url: agency.loginUrl,
            main_website: agency.mainWebsite,
            support_email: agency.supportEmail,
            terms_of_service: agency.termsOfService,
            privacy_policy_url: agency.privacyPolicyUrl,
            password: agency.password,
        };
    }
    mapFromDb(agency) {
        const encryptionService = Container_1.default.resolve("EncryptionService");
        return {
            agencyId: agency.agency_Id,
            userId: agency.user_id,
            name: agency.name,
            branding: agency.branding,
            email: agency.email,
            loginUrl: agency.login_url,
            mainWebsite: agency.main_website,
            supportEmail: agency.support_email,
            termsOfService: agency.terms_of_service,
            privacyPolicyUrl: agency.privacy_policy_url
        };
    }
}
exports.default = AgenciesService;
