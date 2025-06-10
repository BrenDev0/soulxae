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
class PlatformService {
    constructor(repository) {
        this.block = "platforms.service";
        this.repository = repository;
    }
    create(platform) {
        return __awaiter(this, void 0, void 0, function* () {
            const mappedPlatform = this.mapToDb(platform);
            try {
                return this.repository.create(mappedPlatform);
            }
            catch (error) {
                (0, error_service_1.handleServiceError)(error, this.block, "create", mappedPlatform);
                throw error;
            }
        });
    }
    // do not map
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
    update(platformId, changes) {
        return __awaiter(this, void 0, void 0, function* () {
            const mappedChanges = this.mapToDb(changes);
            const cleanedChanges = Object.fromEntries(Object.entries(mappedChanges).filter(([_, value]) => value !== undefined));
            try {
                return yield this.repository.update("platform_id", platformId, cleanedChanges);
            }
            catch (error) {
                (0, error_service_1.handleServiceError)(error, this.block, "update", cleanedChanges);
                throw error;
            }
        });
    }
    delete(platformId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repository.delete("platform_id", platformId);
            }
            catch (error) {
                (0, error_service_1.handleServiceError)(error, this.block, "delete", { platformId });
                throw error;
            }
        });
    }
    mapToDb(platform) {
        const encryptionService = Container_1.default.resolve("EncryptionService");
        return {
            agent_id: platform.agentId,
            platform: platform.platform,
            webhook_url: platform.webhookUrl,
            webhook_secret: platform.webhookSecret && encryptionService.encryptData(platform.webhookSecret),
            token: platform.token && encryptionService.encryptData(platform.token)
        };
    }
    mapFromDb(platform) {
        const encryptionService = Container_1.default.resolve("EncryptionService");
        return {
            platformId: platform.platform_id,
            agentId: platform.agent_id,
            platform: platform.platform,
            webhookUrl: platform.webhook_url,
            webhookSecret: encryptionService.encryptData(platform.webhook_secret),
        };
    }
}
exports.default = PlatformService;
