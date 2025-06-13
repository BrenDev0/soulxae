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
      
  //     await this.clientsService.create(req.body);

  //     res.status(200).json({ message: "Client added." });
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async resourceRequest(req: Request, res: Response): Promise<void> {
    const block = `${this.block}.resourceRequest`;
    try {
      const clientId = req.params.clientId;
      this.httpService.requestValidation.validateUuid(clientId, "clientId", block);

      const resource = await this.clientsService.resource("client_id", clientId);
      if(!resource) {
        throw new NotFoundError(undefined, {
          block: `${block}.clientExistCheck`,
          resource: resource || `No client found in db with id ${clientId}`
        })
      }

      res.status(200).json({ data: resource })
    } catch (error) {
      throw error;
    }
  }

  async collectionRequest(req: Request, res: Response): Promise<void> {
    const block = `${this.block}.resourceRequest`;
    try {
      const agentId = req.params.agentId;
      this.httpService.requestValidation.validateUuid(agentId, "agentId", block);

      const data = await this.clientsService.resource("agent_id", agentId);
      

      res.status(200).json({ data: data })
    } catch (error) {
      throw error;
    }
  }

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

  async deleteRequest(req: Request, res: Response): Promise<void> {
    const block = `${this.block}.deleteRequest`;
    try {
      const clientId = req.params.clientId;
      this.httpService.requestValidation.validateUuid(clientId, "clientId", block);

      const resource = await this.clientsService.resource("client_id", clientId);
      if(!resource) {
        throw new NotFoundError(undefined, {
          block: `${block}.clientExistCheck`,
          resource: resource || `No client found in db with id ${clientId}`
        })
      }
      
      await this.clientsService.delete(clientId);
      res.status(200).json({ message: "Client deleted"})
    } catch (error) {
      throw error;
    }
  }
}
