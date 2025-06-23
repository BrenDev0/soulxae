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
const axios_1 = __importDefault(require("axios"));
class MediaController {
    constructor(httpService, s3Service) {
        this.block = "media.controller";
        this.httpService = httpService;
        this.s3Service = s3Service;
    }
    uploadReferenceDocs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const block = `${this.block}.createRequest`;
            try {
                const file = req.file;
                if (!file) {
                    throw new errors_1.BadRequestError("All fields required", {
                        block: block,
                        reason: "No file in request"
                    });
                }
                const user = req.user;
                const agentId = req.params.agentId;
                this.httpService.requestValidation.validateUuid(agentId, "agentId", block);
                const agentService = Container_1.default.resolve("AgentsService");
                const agentResource = yield agentService.resource(agentId);
                if (!agentResource) {
                    throw new errors_1.NotFoundError("No agent found");
                }
                if (agentResource.userId !== user.user_id) {
                    throw new errors_1.AuthorizationError();
                }
                const key = `temp_for_ empbeding:${user.user_id}:${agentId}`;
                const url = yield this.s3Service.upload(key, file);
                const token = this.httpService.webtokenService.generateToken({
                    userId: user.user_id
                }, "2m");
                const response = yield axios_1.default.post(`https://${process.env.AGENT_WEBHOOK}/api/files/upload`, {
                    agent_id: agentId,
                    s3_url: url,
                    file_type: file === null || file === void 0 ? void 0 : file.mimetype,
                    filename: file === null || file === void 0 ? void 0 : file.originalname
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log("response::::::::::", response);
                yield this.s3Service.delete(key);
                res.status(200).json({ message: "File added to agent references." });
            }
            catch (error) {
                console.log("MEDIAUPLOAD ERROR::::::::::", error);
                throw error;
            }
        });
    }
}
exports.default = MediaController;
