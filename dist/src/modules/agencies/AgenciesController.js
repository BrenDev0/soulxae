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
class AgenciesController {
    constructor(httpService, agenciesService) {
        this.block = "agencies.controller";
        this.httpService = httpService;
        this.agenciesService = agenciesService;
    }
    // async createRequest(req: Request, res: Response): Promise<void> {
    //   const block = `${this.block}.createRequest`;
    //   try {
    //     const  user = req.user;
    //     const requiredFields = ["name", "branding", ];
    //     const agencyData = {
    //     };
    //     await this.agenciesService.create(agencyData);
    //     res.status(200).json({ message: " added." });
    //   } catch (error) {
    //     throw error;
    //   }
    // }
    resourceRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const block = `${this.block}.resourceRequest`;
            try {
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
                const agencyId = req.params.agencyId;
                this.httpService.requestValidation.validateUuid(agencyId, "agencyId", block);
                const resource = yield this.agenciesService.resource(agencyId);
                if (!resource) {
                    throw new errors_1.NotFoundError(undefined, {
                        block: `${block}.notFound`,
                    });
                }
                if (resource.userId !== user.user_id) {
                    if (resource.userId !== user.user_id) {
                        throw new errors_1.AuthorizationError(undefined, {
                            block: `${block}.userCheck`,
                            agencyUserId: resource.userId,
                            userId: user.user_id
                        });
                    }
                }
                const allowedChanges = ["name", "branding", "loginUrl", "mainWebsiteUrl", "supportEmail", "termsOfService", "privacyPolicy"];
                const filteredChanges = this.httpService.requestValidation.filterUpdateRequest(allowedChanges, req.body, block);
                yield this.agenciesService.update(agencyId, filteredChanges);
                res.status(200).json({ message: "updated" });
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
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = AgenciesController;
