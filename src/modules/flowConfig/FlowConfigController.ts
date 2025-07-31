import { Request, Response } from "express";
import HttpService from "../../core/services/HttpService"
import { AuthorizationError, BadRequestError, NotFoundError } from "../../core/errors/errors";
import FlowConfigService from "./FlowConfigService";
import { FlowConfigData } from "./flowConfig.interface";
import AgentsService from "../agents/AgentsService";
import { AgentData } from "../agents/agents.interface";

export default class FlowConfigController { 
  private httpService: HttpService;
  private flowConfigService: FlowConfigService; 
  private agentsService: AgentsService; 
  private block = "flowConfig.controller"; 
  private readonly allwowedServiceproviders =  ["voiceflow"]

  constructor(httpService: HttpService, flowConfigService: FlowConfigService, agentsService: AgentsService) {
    this.httpService = httpService;
    this.flowConfigService = flowConfigService;
    this.agentsService = agentsService;
  }

  async createRequest(req: Request, res: Response): Promise<void> {
    const block = `${this.block}.createRequest`;
    try {
      const user = req.user;
      const agentId = req.params.agentId;
      this.httpService.requestValidation.validateUuid(agentId, "agentId", block);

      const requiredFields = ["provider", "apiKey"];
      this.httpService.requestValidation.validateRequestBody(requiredFields, req.body, block);

      if(!this.allwowedServiceproviders.includes(req.body.provider)) {
        throw new BadRequestError("Flow service provider not supported", {
          requestedProvider: req.body.provider,
          allwowedServiceproviders: this.allwowedServiceproviders
        })
      }
      const agentResource = await this.httpService.requestValidation.validateResource<AgentData>(agentId, "AgentsService", "Agent not found", block);

      this.httpService.requestValidation.validateActionAuthorization(user.user_id, agentResource.userId, block)

      if(agentResource.type !== "flow") {
        throw new BadRequestError("Agent type not supported for flow configuration", {
          agentType: agentResource.type
        })
      }

      const agentHasConfig = await this.flowConfigService.resource(agentId)
      if(agentHasConfig) {
        throw new BadRequestError("Agent has already been configured please update previous configuration")
      }

      const flowConfigData: Omit<FlowConfigData, "flogConfigId"> = {
        ...req.body,
        agentId
      };

      await this.flowConfigService.create(flowConfigData);

      res.status(200).json({ message: "FlowConfig added" });
    } catch (error) {
      throw error;
    }
  }

  async resourceRequest(req: Request, res: Response): Promise<void> {
    const block = `${this.block}.resourceRequest`;
    try {
      const agentId = req.params.agentId;
      this.httpService.requestValidation.validateUuid(agentId, "agentId", block);

      const user = req.user;

      const agentResource = await this.httpService.requestValidation.validateResource<AgentData>(agentId, "AgentsService", "Agent not found", block);

      this.httpService.requestValidation.validateActionAuthorization(user.user_id, agentResource.userId, block)

      const data = await this.flowConfigService.resource(agentId);

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


    const configResource = await this.flowConfigService.resource(agentId);
      if (!configResource) {
        throw new NotFoundError(undefined, {
          block: `${block}.notFound`,
        });
      }

      const allowedChanges = ["apiKey"];

      const filteredChanges = this.httpService.requestValidation.filterUpdateRequest<FlowConfigData>(allowedChanges, req.body, block);

      await this.flowConfigService.update(configResource.flowConfigId, filteredChanges);

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


     const configResource = await this.flowConfigService.resource(agentId);
      if (!configResource) {
        throw new NotFoundError(undefined, {
          block: `${block}.notFound`,
        });
      }

      await this.flowConfigService.delete(configResource.flowConfigId);
      
      res.status(200).json({ message: "Flow configuration deleted" })
    } catch (error) {
      throw error;
    }
  }
}
