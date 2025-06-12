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
class SessionService {
    constructor(client) {
        this.block = "sessions.service";
        this.client = client;
    }
    set(sessionId, session) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.client.setEx(sessionId, 86400, JSON.stringify(session));
                console.log(`Session: ${sessionId} set`);
                return;
            }
            catch (error) {
                throw error;
            }
        });
    }
    get(sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const session = yield this.client.get(sessionId);
                if (session) {
                    return JSON.parse(session);
                }
                return null;
            }
            catch (error) {
                throw error;
            }
        });
    }
    delete(sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.client.del(sessionId);
                console.log("Session deleted");
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = SessionService;
