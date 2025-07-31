import { Request, Response } from "express";
import HttpService from "../../core/services/HttpService"
import { AuthorizationError, BadRequestError, NotFoundError } from "../../core/errors/errors";
import AgentsService from "./AgentsService";
import { AgentData } from "./agents.interface";
import Container from "../../core/dependencies/Container";

export default class AgentsController { 
  private httpService: HttpService;
  private agentsService: AgentsService;  
  private block = "agents.controller"; 
  private readonly allowedAgentTypes =  ["flow", "ai"]

  constructor(httpService: HttpService, agentsService: AgentsService) {
    this.httpService = httpService;
    this.agentsService = agentsService;

  }

  async createRequest(req: Request, res: Response): Promise<void> {
    const block = `${this.block}.createRequest`;
    try {
      const user = req.user;
      const requiredFields = ["type", "name", "description"];
      this.httpService.requestValidation.validateRequestBody(requiredFields, req.body, block);
      const { type } = req.body;

      if(!this.allowedAgentTypes.includes(type)) {
        throw new BadRequestError("Unsupported agent type", {
          allowedTypes: this.allowedAgentTypes,
          request: type
        })
      }
      
      const agentData: AgentData = {
        ...req.body,
        userId: user.user_id
      }

      await this.agentsService.create(agentData);

      res.status(200).json({ message: "Agent added." });
    } catch (error) {
      throw error;
    }
  }

  async resourceRequest(req: Request, res: Response): Promise<void> {
    const block = `${this.block}.resourceRequest`;
    try {
      const user = req.user;
      const agentId = req.params.agentId;
      this.httpService.requestValidation.validateUuid(agentId, "agentId", block);

      const agentResource = await this.httpService.requestValidation.validateResource<AgentData>(agentId, "AgentsService", "Agent not found", block);

      this.httpService.requestValidation.validateActionAuthorization(user.user_id, agentResource.userId, block)


      res.status(200).json({ data: agentResource})
    } catch (error) {
      throw error;
    }
  }

   async collectionRequest(req: Request, res: Response): Promise<void> {
    const block = `${this.block}.collectionRequest`;
    try {
      const user = req.user;

      const data = await this.agentsService.collection(user.user_id)

      res.status(200).json({ data: data })
    } catch (error) {
      throw error;
    }
  }

  async updateRequest(req: Request, res: Response): Promise<void> {
    const block = `${this.block}.updateRequest`;
    try { 
      const user = req.user;
      const agentId = req.params.agentId;
      this.httpService.requestValidation.validateUuid(agentId, "agentId", block);

     const agentResource = await this.httpService.requestValidation.validateResource<AgentData>(agentId, "AgentsService", "Agent not found", block);

      this.httpService.requestValidation.validateActionAuthorization(user.user_id, agentResource.userId, block)

      const allowedChanges = ["name", "description"];

      const filteredChanges = this.httpService.requestValidation.filterUpdateRequest<AgentData>(allowedChanges, req.body, block);

      await this.agentsService.update(agentId, filteredChanges);

      res.status(200).json({ message: "Agent updated" });
    } catch (error) {
      throw error;
    }
  }

  async deleteRequest(req: Request, res: Response): Promise<void> {
    const block = `${this.block}.deleteRequest`;
    try {
      const user = req.user;
      const agentId = req.params.agentId;
      this.httpService.requestValidation.validateUuid(agentId, "agentId", block);

     const agentResource = await this.httpService.requestValidation.validateResource<AgentData>(agentId, "AgentsService", "Agent not found", block);

      this.httpService.requestValidation.validateActionAuthorization(user.user_id, agentResource.userId, block)

      await this.agentsService.delete(agentId);
      res.status(200).json({ message: "Agent deleted"})
    } catch (error) {
      throw error;
    }
  }
}
