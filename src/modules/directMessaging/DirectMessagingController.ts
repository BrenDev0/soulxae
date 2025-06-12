import { Request, Response } from "express";
import HttpService from "../../core/services/HttpService"

export default class DirectMessagagingController {
    private httpService: HttpService;
    constructor(httpService: HttpService) {
        this.httpService = httpService;
    }

    async incomingMessage(req: Request, res: Response): Promise<void> {
        try {
            console.log(req.body)
        } catch (error) {
            throw error;
        }
    }
}