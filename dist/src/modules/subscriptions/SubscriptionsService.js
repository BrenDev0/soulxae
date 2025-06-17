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
class SubscriptionsService {
    constructor(repository) {
        this.block = "subscriptions.service";
        this.repository = repository;
    }
    create(subscriptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const mappedSubscription = this.mapToDb(subscriptions);
            try {
                return this.repository.create(mappedSubscription);
            }
            catch (error) {
                (0, error_service_1.handleServiceError)(error, this.block, "create", mappedSubscription);
                throw error;
            }
        });
    }
    resource(subscriptionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.repository.selectOne("subscription_id", subscriptionId);
                if (!result) {
                    return null;
                }
                return this.mapFromDb(result);
            }
            catch (error) {
                (0, error_service_1.handleServiceError)(error, this.block, "resource", { subscriptionId });
                throw error;
            }
        });
    }
    update(subscriptionId, changes) {
        return __awaiter(this, void 0, void 0, function* () {
            const mappedChanges = this.mapToDb(changes);
            const cleanedChanges = Object.fromEntries(Object.entries(mappedChanges).filter(([_, value]) => value !== undefined));
            try {
                return yield this.repository.update("subscription_id", subscriptionId, cleanedChanges);
            }
            catch (error) {
                (0, error_service_1.handleServiceError)(error, this.block, "update", cleanedChanges);
                throw error;
            }
        });
    }
    delete(subscriptionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repository.delete("Subscription_id", subscriptionId);
            }
            catch (error) {
                (0, error_service_1.handleServiceError)(error, this.block, "delete", { subscriptionId });
                throw error;
            }
        });
    }
    mapToDb(subscription) {
        const encryptionService = Container_1.default.resolve("EncryptionService");
        return {
            name: subscription.name,
            details: subscription.details,
            price_month: subscription.priceMonth,
            price_year: subscription.priceYear,
            agency_limit: subscription.agencyLimit,
            agent_limit: subscription.agentLimit
        };
    }
    mapFromDb(subscription) {
        const encryptionService = Container_1.default.resolve("EncryptionService");
        return {
            subscriptionId: subscription.subscription_id,
            name: subscription.name,
            details: subscription.details,
            priceMonth: subscription.price_month,
            priceYear: subscription.price_year,
            agencyLimit: subscription.agency_limit,
            agentLimit: subscription.agent_limit
        };
    }
}
exports.default = SubscriptionsService;
