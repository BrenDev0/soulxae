"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Error = void 0;
const AppError_1 = __importDefault(require("../../core/errors/AppError"));
class S3Error extends AppError_1.default {
    constructor(message = 's3 bucket operation failed', context) {
        super(message, 500, false, context);
        this.name = 'S3Error';
    }
}
exports.S3Error = S3Error;
