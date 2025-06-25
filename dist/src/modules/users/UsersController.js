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
class UsersController {
    constructor(httpService, usersService, emailService) {
        this.block = "users.controller";
        this.httpService = httpService;
        this.usersService = usersService;
        this.emailService = emailService;
    }
    verifyEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const block = `${this.block}.verifyEmail`;
            try {
                const { email } = req.body;
                const requiredFields = ["email"];
                const update = req.query.update === "true";
                this.httpService.requestValidation.validateRequestBody(requiredFields, req.body, block);
                const encryptedEmail = this.httpService.encryptionService.encryptData(email);
                const emailExists = yield this.usersService.resource("email", encryptedEmail);
                if (emailExists) {
                    throw new errors_1.BadRequestError("Email in use", {
                        block: `${block}.emailExists`,
                        email: email
                    });
                }
                const requestType = update ? "UPDATE" : "NEW";
                const token = yield this.emailService.handleRequest(email, requestType, this.httpService.webtokenService);
                res.status(200).json({
                    message: "Verification email sent.",
                    token: token
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    createRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const block = `${this.block}.createRequest`;
            try {
                const { password } = req.body;
                const requiredFields = ["email", "password", "name"];
                this.httpService.requestValidation.validateRequestBody(requiredFields, req.body, block);
                const hashedPassword = yield this.httpService.passwordService.hashPassword(password);
                const userData = Object.assign(Object.assign({}, req.body), { password: hashedPassword, isAdmin: true });
                yield this.usersService.create(userData);
                res.status(200).json({ message: "User added." });
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
                const data = this.usersService.mapFromDb(user);
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
                const allowedChanges = ["subscription", "password", "name"];
                const filteredChanges = this.httpService.requestValidation.filterUpdateRequest(allowedChanges, req.body, block);
                if (req.body.password) {
                    const { password, oldPassword } = req.body;
                    if (!oldPassword) {
                        throw new errors_1.BadRequestError("Current password required for password update");
                    }
                    ;
                    const correctPassword = this.httpService.passwordService.comparePassword(oldPassword, user.password);
                    if (!correctPassword) {
                        throw new errors_1.BadRequestError("Incorrect password");
                    }
                    const hashedPassword = yield this.httpService.passwordService.hashPassword(password);
                    filteredChanges.password = hashedPassword;
                }
                yield this.usersService.update(user.user_id, filteredChanges);
                res.status(200).json({ message: "User updated" });
            }
            catch (error) {
                throw error;
            }
        });
    }
    verifiedUpdateRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const block = `${this.block}.verifiedUpdateRequest`;
            try {
                const userId = req.params.userId;
                this.httpService.requestValidation.validateUuid(userId, "userId", block);
                const user = yield this.usersService.resource("user_id", userId);
                if (!user) {
                    throw new errors_1.BadRequestError(undefined, {
                        block: `${block}.userCheck`,
                        user: user || "user not found"
                    });
                }
                const allowedChanges = ["email", "password"];
                const filteredChanges = this.httpService.requestValidation.filterUpdateRequest(allowedChanges, req.body, block);
                if (filteredChanges.password) {
                    const hashedPassword = yield this.httpService.passwordService.hashPassword(filteredChanges.password);
                    filteredChanges.password = hashedPassword;
                }
                yield this.usersService.update(userId, filteredChanges);
                res.status(200).json({ message: "User updated" });
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
                yield this.usersService.delete(user.user_id);
                res.status(200).json({ message: "User Deleted" });
            }
            catch (error) {
                throw error;
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const block = `${this.block}.login`;
            try {
                const { email, password } = req.body;
                const requiredFields = ["email", "password"];
                this.httpService.requestValidation.validateRequestBody(requiredFields, req.body, block);
                const encryptedEmail = this.httpService.encryptionService.encryptData(email);
                const userExists = yield this.usersService.resource("email", encryptedEmail);
                if (!userExists) {
                    throw new errors_1.BadRequestError("Incorrect email or password", {
                        block: `${block}.userExists`,
                        email: email,
                        userExists: userExists || "No user found in db"
                    });
                }
                ;
                const correctPassword = userExists.is_admin
                    ? yield this.httpService.passwordService.comparePassword(password, userExists.password)
                    : password === this.httpService.encryptionService.decryptData(userExists.password);
                if (!correctPassword) {
                    throw new errors_1.BadRequestError("Incorrect email or password", {
                        block: `${block}.passwordValidation`,
                        correctPassword: false
                    });
                }
                ;
                const token = this.httpService.webtokenService.generateToken({
                    userId: userExists.user_id
                }, "7d");
                res.status(200).json({
                    token: token
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    accountRecoveryEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const block = `${this.block}.accountRecoveryEmail`;
            try {
                const { email } = req.body;
                const requiredFields = ["email"];
                this.httpService.requestValidation.validateRequestBody(requiredFields, req.body, block);
                const encryptedEmail = this.httpService.encryptionService.encryptData(email);
                const emailExists = yield this.usersService.resource("email", encryptedEmail);
                if (!emailExists) {
                    throw new errors_1.BadRequestError("Incorrect email", {
                        block: `${block}.emailCheck`,
                        email: email,
                        emailExists: emailExists || "No user found in db"
                    });
                }
                ;
                const token = yield this.emailService.handleRequest(email, "RECOVERY", this.httpService.webtokenService);
                res.status(200).json({
                    message: "Recovery email sent",
                    token: token
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = UsersController;
