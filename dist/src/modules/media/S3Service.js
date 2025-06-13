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
const client_s3_1 = require("@aws-sdk/client-s3");
const errors_1 = require("../../core/errors/errors");
const media_errors_1 = require("./media.errors");
class S3Service {
    constructor(client, bucket) {
        this.block = "S3Service";
        this.client = client;
        this.bucket = bucket;
    }
    upload(key, file) {
        return __awaiter(this, void 0, void 0, function* () {
            const uploadParams = {
                Bucket: this.bucket,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype
            };
            const imageUrl = `https://${this.bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`;
            try {
                const command = new client_s3_1.PutObjectCommand(uploadParams);
                yield this.client.send(command);
                return imageUrl;
            }
            catch (error) {
                throw new media_errors_1.S3Error("Unable to Upload to bucket", {
                    originalError: error.message,
                    block: `${this.block}.upload`,
                    key,
                    filename: file.originalname,
                });
            }
        });
    }
    uploadBuffer(key, buffer, contentType) {
        return __awaiter(this, void 0, void 0, function* () {
            const uploadParams = {
                Bucket: this.bucket,
                Key: key,
                Body: buffer,
                ContentType: contentType,
            };
            const imageUrl = `https://${this.bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
            try {
                const command = new client_s3_1.PutObjectCommand(uploadParams);
                yield this.client.send(command);
                return imageUrl;
            }
            catch (error) {
                throw new media_errors_1.S3Error("Unable to upload buffer to bucket", {
                    originalError: error.message,
                    block: `${this.block}.uploadBuffer`,
                    key,
                });
            }
        });
    }
    delete(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const block = `${this.block}.delete`;
            try {
                const listParams = {
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Prefix: key
                };
                const listCommad = new client_s3_1.ListObjectsV2Command(listParams);
                const listedObjects = yield this.client.send(listCommad);
                if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
                    throw new errors_1.NotFoundError("Content not found.", {
                        block: `${block}.contentNotFound`,
                        listParams: listParams,
                        listedObjects: listedObjects
                    });
                }
                ;
                const deleteParams = {
                    Bucket: this.bucket,
                    Delete: {
                        Objects: listedObjects.Contents
                            .filter((obj) => obj.Key !== undefined)
                            .map((obj) => {
                            return {
                                Key: obj.Key
                            };
                        })
                    }
                };
                const deleteCommand = new client_s3_1.DeleteObjectsCommand(deleteParams);
                yield this.client.send(deleteCommand);
            }
            catch (error) {
                if (error instanceof errors_1.NotFoundError)
                    throw error;
                throw new media_errors_1.S3Error("Unable to delete", {
                    block: block,
                    originalError: error.message,
                    key: key,
                    bucketName: process.env.AWS_BUCKET_NAME || "**MISING**"
                });
            }
        });
    }
}
exports.default = S3Service;
