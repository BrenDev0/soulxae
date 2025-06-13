import { Pool } from "pg";
import BaseRepository from "../../core/repository/BaseRepository";
import { Media } from "./media.interface";
import MediaService from "./S3Service";
import MediaController from "./MediaController";
import Container from "../../core/dependencies/Container";
import HttpService from "../../core/services/HttpService";
import { S3Client } from "@aws-sdk/client-s3";
import S3Service from "./S3Service";

export function configureMediaDependencies(pool: Pool): void {
     const {
        AWS_REGION,
        AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY,
        AWS_BUCKET_NAME
    } = process.env;

    const client = new S3Client({
            region: AWS_REGION || "",
            credentials: {
                accessKeyId: AWS_ACCESS_KEY_ID || "",
                secretAccessKey: AWS_SECRET_ACCESS_KEY ||""
            }
        });

    const service = new S3Service(client, AWS_BUCKET_NAME || "");

    Container.register<S3Service>("S3Service", service);
    return;
}
