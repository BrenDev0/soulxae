import { Request, Response } from "express";
import { BadRequestError, NotFoundError } from "../../core/errors/errors";
import { RedisClientType } from "redis";
import Container from "../../core/dependencies/Container";
import GoogleService from "./GoogleService";
import EncryptionService from "../../core/services/EncryptionService";
import HttpService from "../../core/services/HttpService";
import { GoogleSession } from "./google.interface";

export default class GoogleController {
    private readonly block = "google.controller";
    private httpService: HttpService;
    private googleService: GoogleService; 
   
    constructor(httpService: HttpService , googleService: GoogleService) {
        this.httpService = httpService
        this.googleService = googleService
    }

    async callback(req: Request, res: Response): Promise<void> {
        try {
            const { code, state } = req.query;

            if (!code || !state) {
                throw new BadRequestError('Missing code or state');
            }

            const client = this.googleService.clientManager.getClient();

            const redisClient = Container.resolve<RedisClientType>("RedisClient");
            const session = await redisClient.get(`oauth_state:${state}`);
            if (!session) {
                throw new BadRequestError('Invalid or expired state');
            };

            // Exchange authorization code for access token
            const { tokens } = await client.getToken(code as string);
            console.log(tokens)
            client.setCredentials(tokens);

            if(!tokens.refresh_token) {
                throw new BadRequestError("Google authorization failed");
            }
            
            const googleSession: GoogleSession = JSON.parse(session)
           

            await this.googleService.clientManager.upsertToken(tokens.refresh_token, googleSession.userId)
        
            
            res.status(200).send()
        } catch (error) {
            console.log(error)
            throw error;
        }
    }

    async getUrl(req: Request, res: Response): Promise<void> {
        try {
            const user = req.user
            const client = this.googleService.clientManager.getClient()
            const url = this.googleService.getUrl(client, user.user_id);

            res.status(200).json({
                url: url
            })
        } catch (error) {
            throw error;
        }
    }   
}

   