import { Request, Response } from "express";
import HttpService from "../../core/services/HttpService"
import { BadRequestError, NotFoundError } from "../../core/errors/errors";
import ConversationsService from "./ConversationsService";
import { ConversationData } from "./conversations.interface";

export default class ConversationsController { 
  private httpService: HttpService;
  private conversationsService: ConversationsService;  
  private block = "conversations.controller"; 
  

  constructor(httpService: HttpService, conversationsService: ConversationsService) {
    this.httpService = httpService;
    this.conversationsService = conversationsService;
  }

  // async createRequest(req: Request, res: Response): Promise<void> {
  //   const block = `${this.block}.createRequest`;
  //   try {
  //     const requiredFields = [""];


  //     const conversationData = {
    
  //     };

  //     await this.conversationsService.create(conversationData);

  //     res.status(200).json({ message: " added." });
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async resourceRequest(req: Request, res: Response): Promise<void> {
    const block = `${this.block}.resourceRequest`;
    try {
      const conversationId = req.params.conversationId;
      this.httpService.requestValidation.validateUuid(conversationId, "conversationId", block);

      const resource = await this.conversationsService.resource(conversationId);
      if(!resource) {
        throw new NotFoundError(undefined, {
          block: `${block}.conversationExistCheck`,
          resource: resource || `No conversation found in db with id ${conversationId}`
        })
      }

      res.status(200).json({ data: resource })
    } catch (error) {
      throw error;
    }
  }

  async updateRequest(req: Request, res: Response): Promise<void> {
    const block = `${this.block}.updateRequest`;
    try { 
     const conversationId = req.params.conversationId;
      this.httpService.requestValidation.validateUuid(conversationId, "conversationId", block);

      const resource = await this.conversationsService.resource(conversationId);
      if(!resource) {
        throw new NotFoundError(undefined, {
          block: `${block}.conversationExistCheck`,
          resource: resource || `No conversation found in db with id ${conversationId}`
        })
      }
      const allowedChanges = [""];

      const filteredChanges = this.httpService.requestValidation.filterUpdateRequest<ConversationData>(allowedChanges, req.body, block);

      await this.conversationsService.update(conversationId, filteredChanges);

      res.status(200).json({ message: "updated" });
    } catch (error) {
      throw error;
    }
  }

  async deleteRequest(req: Request, res: Response): Promise<void> {
    const block = `${this.block}.deleteRequest`;
    try {
      const conversationId = req.params.conversationId;
      this.httpService.requestValidation.validateUuid(conversationId, "conversationId", block);

      const resource = await this.conversationsService.resource(conversationId);
      if(!resource) {
        throw new NotFoundError(undefined, {
          block: `${block}.conversationExistCheck`,
          resource: resource || `No conversation found in db with id ${conversationId}`
        })
      }
      
      await this.conversationsService.delete(conversationId);
      res.status(200).json({ message: "Conversation deleted"})
    } catch (error) {
      throw error;
    }
  }
}
