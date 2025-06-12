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

  async createRequest(req: Request, res: Response): Promise<void> {
    const block = `${this.block}.createRequest`;
    try {
      const requiredFields = ["message"];
      this.httpService.requestValidation.validateRequestBody(requiredFields, req.body, block);

      const message = req.body.message as MessageData;

      const conversationService = Container.resolve<ConversationsService>("ConversationsService");
      const conversation = await conversationService.getAPIData(message.conversationId);
      if(!conversation) {
        throw new NotFoundError(undefined, {
          conversation: conversation || `No conversation found in db with id: ${message.conversationId}` 
        })
      }
      
      switch(conversation.platform) {
        case "whatsapp":
          const whatsappService = Container.resolve<WhatsappService>("WhatsappService");
          await whatsappService.handleOutgoingMessage(message.content, conversation.platformIdentifier, conversation.clientIdentifier, conversation.token)
          break;
        default: 
          throw new BadRequestError("Code nfinished messages.controller.createReqquest")  
      }
      
      await this.messagesService.create(message);
      
      res.status(200).json({ message: "Message added" });
    } catch (error) {
      throw error;
    }
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
