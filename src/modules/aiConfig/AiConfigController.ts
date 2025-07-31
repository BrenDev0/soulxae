import { Request, Response } from "express";
import HttpService from "../../core/services/HttpService"
import { AuthorizationError, BadRequestError, NotFoundError } from "../../core/errors/errors";
import AiConfigService from "./AiConfigService";
import { AiConfigData } from "./aiConfig.interface";
import Container from "../../core/dependencies/Container";
import AgentsService from "../agents/AgentsService";
import { AgentData } from "../agents/agents.interface";

export default class AiConfigController { 
  private httpService: HttpService;
  private aiConfigService: AiConfigService; 
  private agentsService: AgentsService; 
  private block = "aiConfig.controller"; 
  

  constructor(httpService: HttpService, aiConfigService: AiConfigService, agentsService: AgentsService) {
    this.httpService = httpService;
    this.aiConfigService = aiConfigService;
    this.agentsService = agentsService
  }

  async createRequest(req: Request, res: Response): Promise<void> {
    const block = `${this.block}.createRequest`;
    try {
      const requiredFields = ["systemPrompt", "maxTokens", "temperature"];
      this.httpService.requestValidation.validateRequestBody(requiredFields, req.body, block);

      const user = req.user;
      const agentId = req.params.agentId;
      this.httpService.requestValidation.validateUuid(agentId, "agentId", block);

      const agentResource = await this.httpService.requestValidation.validateResource<AgentData>(agentId, "AgentsService", "Agent not found", block);
      
      this.httpService.requestValidation.validateActionAuthorization(user.user_id, agentResource.userId, block)

      if(agentResource.type !== "ai") {
        throw new BadRequestError("Agent type not supported for ai configuration", {
          agentType: agentResource.type
        })
      }

      const agentHasConfig = await this.aiConfigService.resource(agentId)
      if(agentHasConfig) {
        throw new BadRequestError("Agent has already been configured please update previous configuration")
      }

      const aiConfigData: Omit<AiConfigData, "aiConfigId"> = {
        ...req.body,
        agentId: agentId
      };

      await this.aiConfigService.create(aiConfigData);

      res.status(200).json({ message: "AiConfig added" });
    } catch (error) {
      throw error;
    }
  }

  async resourceRequest(req: Request, res: Response): Promise<void> {
    const block = `${this.block}.resourceRequest`;
    try {
      const agentId = req.params.agentId;
      this.httpService.requestValidation.validateUuid(agentId, "agentId", block)
      const user = req.user;

      const agentResource = await this.httpService.requestValidation.validateResource<AgentData>(agentId, "AgentsService", "Agent not found", block);

      this.httpService.requestValidation.validateActionAuthorization(user.user_id, agentResource.userId, block)


      const data = await this.aiConfigService.resource(agentId);

      res.status(200).json({ data: data })
    } catch (error) {
      throw error;
    }
  }

  async updateRequest(req: Request, res: Response): Promise<void> {
    const block = `${this.block}.updateRequest`;
    try { 
      const agentId = req.params.agetnId;
      this.httpService.requestValidation.validateUuid(agentId, "agentId", block);

      const user = req.user;

      const agentResource = await this.httpService.requestValidation.validateResource<AgentData>(agentId, "AgentsService", "Agent not found", block);

      this.httpService.requestValidation.validateActionAuthorization(user.user_id, agentResource.userId, block)


     const configResource = await this.aiConfigService.resource(agentId);
      if (!configResource) {
        throw new NotFoundError(undefined, {
          block: `${block}.notFound`,
        });
      }

      const allowedChanges = ["systemPrompt", "maxTokens", "temperature"];

      const filteredChanges = this.httpService.requestValidation.filterUpdateRequest<AiConfigData>(allowedChanges, req.body, block);

      await this.aiConfigService.update(configResource.aiConfigId, filteredChanges);

      res.status(200).json({ message: "AiConfig updated" });
    } catch (error) {
      throw error;
    }
  }

  async deleteRequest(req: Request, res: Response): Promise<void> {
    const block = `${this.block}.deleteRequest`;
    try {
      const agentId = req.params.agetnId;
      this.httpService.requestValidation.validateUuid(agentId, "agentId", block);

      const user = req.user;

      const agentResource = await this.httpService.requestValidation.validateResource<AgentData>(agentId, "AgentsService", "Agent not found", block);
      
      this.httpService.requestValidation.validateActionAuthorization(user.user_id, agentResource.userId, block)


     const configResource = await this.aiConfigService.resource(agentId);
      if (!configResource) {
        throw new NotFoundError(undefined, {
          block: `${block}.notFound`,
        });
      }

      await this.aiConfigService.delete(configResource.aiConfigId);
      
      res.status(200).json({ message: "Ai configuration deleted" })
    } catch (error) {
      throw error;
    }
  }
}
