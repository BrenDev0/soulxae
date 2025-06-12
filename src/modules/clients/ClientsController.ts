import { Request, Response } from "express";
import HttpService from "../../core/services/HttpService"
import { BadRequestError, NotFoundError } from "../../core/errors/errors";
import ClientsService from "./ClientsService";
import { ClientData } from "./clients.interface";

export default class ClientsController { 
  private httpService: HttpService;
  private clientsService: ClientsService;  
  private block = "clients.controller"; 
  

  constructor(httpService: HttpService, clientsService: ClientsService) {
    this.httpService = httpService;
    this.clientsService = clientsService;
  }

  // async createRequest(req: Request, res: Response): Promise<void> {
  //   const block = `${this.block}.createRequest`;
  //   try {
  //     const requiredFields = ["agentId", "name", "contactIdentifier"];
  //     this.httpService.requestValidation.validateRequestBody(requiredFields, req.body, block);
  //     const { agentId } = req.body;

  //     this.httpService.requestValidation.validateUuid(agentId, "agentId", block);
      
  //     await this.clientsService.create(clientData);

  //     res.status(200).json({ message: " added." });
  //   } catch (error) {
  //     throw error;
  //   }
  // }

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
  //    const resource = await this.clientsService.resource(user.user_id);
  //     if (!resource) {
  //       throw new NotFoundError(undefined, {
  //         block: `${block}.notFound`,
  //       });
  //     }
  //     const allowedChanges = [""];

  //     const filteredChanges = this.htttpService.requestValidation.filterUpdateRequest<ClientsData>(allowedChanges, req.body, block);

  //     await this.clientsService.update(filteredChanges);

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
