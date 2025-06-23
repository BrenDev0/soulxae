"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureMediaDependencies = configureMediaDependencies;
const Container_1 = __importDefault(require("../../core/dependencies/Container"));
const client_s3_1 = require("@aws-sdk/client-s3");
const S3Service_1 = __importDefault(require("./S3Service"));
const MediaController_1 = __importDefault(require("./MediaController"));
function configureMediaDependencies(pool) {
    const { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_BUCKET_NAME } = process.env;
    const client = new client_s3_1.S3Client({
        region: AWS_REGION || "",
        credentials: {
            accessKeyId: AWS_ACCESS_KEY_ID || "",
            secretAccessKey: AWS_SECRET_ACCESS_KEY || ""
        }
    });
    const service = new S3Service_1.default(client, AWS_BUCKET_NAME || "");
    const httpService = Container_1.default.resolve("HttpService");
    const controller = new MediaController_1.default(httpService, service);
    Container_1.default.register("MediaController", controller);
    Container_1.default.register("S3Service", service);
    return;
}
