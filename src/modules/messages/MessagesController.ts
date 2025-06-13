import { Request, Response } from "express";
import HttpService from "../../core/services/HttpService"
import { BadRequestError, NotFoundError } from "../../core/errors/errors";
import MessagesService from "./MessagesService";
import { MessageData } from "./messages.interface";
import Container from "../../core/dependencies/Container";
import ConversationsService from "../conversations/ConversationsService";
import WhatsappService from "../whatsapp/WhatsappService";

export default class MessagesController { 
  private httpService: HttpService;
  private messagesService: MessagesService;  
  private block = "messages.controller"; 

  constructor(httpService: HttpService, messagesService: MessagesService) {
    this.httpService = httpService;
    this.messagesService = messagesService;
  }

  
  // async resourceRequest(req: Request, res: Response): Promise<void> {
  //   const block = `${this.block}.resourceRequest`;
  //   try {
      
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async updateRequest(req: Request, res: Response): Promise<void> {
  //   const block = `${this.block}.updateRequest`;
  //   try { 
  //    const resource = await this.messagesService.resource(user.user_id);
  //     if (!resource) {
  //       throw new NotFoundError(undefined, {
  //         block: `${block}.notFound`,
  //       });
  //     }
  //     const allowedChanges = [""];

  //     const filteredChanges = this.htttpService.requestValidation.filterUpdateRequest<MessagesData>(allowedChanges, req.body, block);

  //     await this.messagesService.update(filteredChanges);

  //     res.status(200).json({ message: "updated" });
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async deleteRequest(req: Request, res: Response): Promise<void> {
  //   const block = `${this.block}.deleteRequest`;
  //   try {
     
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}
