import { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectsCommand } from '@aws-sdk/client-s3'
import { NotFoundError} from '../../core/errors/errors';
import { S3Error } from './media.errors';

export default class S3Service {
    private client: S3Client;
    private block = "S3Service";
    private bucket: string;

    constructor(client: S3Client, bucket: string) {
        this.client = client;
        this.bucket = bucket
    }

    async upload(key: string, file: Express.Multer.File): Promise<string> {
        
        const uploadParams = {
            Bucket: this.bucket,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype
        };

        const imageUrl = `https://${this.bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`;
        try {
            const command = new PutObjectCommand(uploadParams);
            
            await this.client.send(command);

            return imageUrl;
        } catch (error) {
            throw new S3Error("Unable to Upload to bucket", {
                originalError: (error as Error).message,
                block: `${this.block}.upload`,
                key,
                filename: file.originalname,
            });
        }
    }

    async uploadBuffer(key: string, buffer: Buffer, contentType: string): Promise<string> {
    const uploadParams = {
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
    };

    const imageUrl = `https://${this.bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    try {
        const command = new PutObjectCommand(uploadParams);
        await this.client.send(command);
        return imageUrl;
    } catch (error) {
        throw new S3Error("Unable to upload buffer to bucket", {
            originalError: (error as Error).message,
            block: `${this.block}.uploadBuffer`,
            key,
        });
    }
}


    async delete(key: string): Promise<void> {
        const block = `${this.block}.delete`
        try {
            const listParams = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Prefix: key
            };

            const  listCommad = new ListObjectsV2Command(listParams);

            const listedObjects = await this.client.send(listCommad);

            if(!listedObjects.Contents || listedObjects.Contents.length === 0) {
                throw new NotFoundError("Content not found.", {
                    block: `${block}.contentNotFound`,
                    listParams: listParams,
                    listedObjects: listedObjects
                });
            };

            const deleteParams = {
                Bucket: this.bucket,
                Delete: {
                    Objects: listedObjects.Contents
                    .filter((obj) => obj.Key !== undefined)
                    .map((obj) => {
                        return {
                            Key: obj.Key
                        }
                    })
                }
            };

            const deleteCommand = new DeleteObjectsCommand(deleteParams)

            await this.client.send(deleteCommand)
        } catch (error) {
            if (error instanceof NotFoundError) throw error;

            throw new S3Error("Unable to delete", {
                block: block,
                originalError: (error as Error).message,
                key: key,
                bucketName: process.env.AWS_BUCKET_NAME || "**MISING**"
            });
        }
    }
}