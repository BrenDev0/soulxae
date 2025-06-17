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
class SubscriptionsController {
    constructor(httpService, subscriptionsService) {
        this.block = "subscriptions.controller";
        this.httpService = httpService;
        this.subscriptionsService = subscriptionsService;
    }
    createRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const block = `${this.block}.createRequest`;
            try {
                const requiredFields = ["name", "details", "priceMonth", "priceYear", "agencyLimit", "agentLimit"];
                this.httpService.requestValidation.validateRequestBody(requiredFields, req.body, block);
                yield this.subscriptionsService.create(req.body);
                res.status(200).json({ message: "Subscription added" });
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
                const subscriptionId = req.params.subscriptionId;
                this.httpService.requestValidation.validateUuid(subscriptionId, "subscriptionId", block);
                const resource = yield this.subscriptionsService.resource(subscriptionId);
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
    updateRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const block = `${this.block}.updateRequest`;
            try {
                const subscriptionId = req.params.subscriptionId;
                this.httpService.requestValidation.validateUuid(subscriptionId, "subscriptionId", block);
                const resource = yield this.subscriptionsService.resource(subscriptionId);
                if (!resource) {
                    throw new errors_1.NotFoundError(undefined, {
                        block: `${block}.notFound`,
                    });
                }
                const allowedChanges = ["name", "details", "priceMonth", "priceYear", "agencyLimit", "agentLimit"];
                const filteredChanges = this.httpService.requestValidation.filterUpdateRequest(allowedChanges, req.body, block);
                yield this.subscriptionsService.update(subscriptionId, filteredChanges);
                res.status(200).json({ message: "Subscription updated" });
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
                const subscriptionId = req.params.subscriptionId;
                this.httpService.requestValidation.validateUuid(subscriptionId, "subscriptionId", block);
                const resource = yield this.subscriptionsService.resource(subscriptionId);
                if (!resource) {
                    throw new errors_1.NotFoundError(undefined, {
                        block: `${block}.notFound`,
                    });
                }
                yield this.subscriptionsService.delete(subscriptionId);
                res.status(200).json({ message: "Subscription deleted" });
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = SubscriptionsController;
