import { Request, Response } from "express";
import HttpService from "../../core/services/HttpService"
import { AuthorizationError, BadRequestError, NotFoundError } from "../../core/errors/errors";
import AgentsService from "./AgentsService";
import { AgentData } from "./agents.interface";
import Container from "../../core/dependencies/Container";
import WorkspaceService from "../workspaces/WorkspacesService";
import { agent } from "supertest";

export default class AgentsController { 
  private httpService: HttpService;
  private agentsService: AgentsService;  
  private block = "agents.controller"; 
  private readonly allowedAgentTypes =  ["bot", "human"]

  constructor(httpService: HttpService, agentsService: AgentsService) {
    this.httpService = httpService;
    this.agentsService = agentsService;

  }

  async createRequest(req: Request, res: Response): Promise<void> {
    const block = `${this.block}.createRequest`;
    try {
      const user = req.user;
      const requiredFields = ["apiKey", "description", "name", "provider", "workspaceId", "agentType"];
      this.httpService.requestValidation.validateRequestBody(requiredFields, req.body, block);
      
      const{ workspaceId, agentType } = req.body;
      this.httpService.requestValidation.validateUuid(workspaceId, "workspaceId", block);

      const workspaceService = Container.resolve<WorkspaceService>("WorkspacesService");
      const resource = await workspaceService.resource(workspaceId);
      if(!resource) {
        throw new NotFoundError("No workspce found", {
          block: `${block}.workspaceExistsCheck`,
          workspaceId: workspaceId
        })
      }

      if(resource.userId !== user.user_id) {
        throw new AuthorizationError(undefined, {
          block: `${block}.userCheck`,
          workspaceUserId: resource.userId,
          userId: user.user_id
        })
      }

      if (!this.allowedAgentTypes.includes(agentType)) {
        throw new BadRequestError("Invalid agent type", {
          allowedAgentTypes: this.allowedAgentTypes,
          type: agentType
        }) 
      }

      await this.agentsService.create(req.body);

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

      const resource = await this.agentsService.resource(agentId);
      if(!resource) {
        throw new NotFoundError("Agent not found")
      }

      if(resource.userId !== user.user_id) {
        throw new AuthorizationError(undefined, {
          block: `${block}.userCheck`,
          workspaceUserId: resource.userId,
          userId: user.user_id
        })
      }


      res.status(200).json({ data: resource})
    } catch (error) {
      throw error;
    }
  }

   async collectionRequest(req: Request, res: Response): Promise<void> {
    const block = `${this.block}.collectionRequest`;
    try {
      const user = req.user;
      const workspaceId = req.params.workspaceId;
      this.httpService.requestValidation.validateUuid(workspaceId, "workspaceId", block);

      const workspaceService = Container.resolve<WorkspaceService>("WorkspacesService");
      const resource = await workspaceService.resource(workspaceId);
      if(!resource) {
        throw new NotFoundError("workspace not found")
      }

      if(resource.userId !== user.user_id) {
        throw new AuthorizationError(undefined, {
          block: `${block}.userCheck`,
          workspaceUserId: resource.userId,
          user: user.user_id
        })
      }

      const data = await this.agentsService.collection(workspaceId)

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

     const resource = await this.agentsService.resource(agentId);
      if (!resource) {
        throw new NotFoundError(undefined, {
          block: `${block}.notFound`,
        });
      }

      if(resource.userId !== user.user_id) {
        throw new AuthorizationError(undefined, {
          block: `${block}.userCheck`,
          workspaceUserId: resource.userId,
          userId: user.user_id
        })
      }


      const allowedChanges = ["name", "description", "apiKey", "provider", "agentType"];

      const filteredChanges = this.httpService.requestValidation.filterUpdateRequest<AgentData>(allowedChanges, req.body, block);

       if (filteredChanges.agentType && !this.allowedAgentTypes.includes(filteredChanges.agentType)) {
        throw new BadRequestError("Invalid agent type", {
          allowedAgentTypes: this.allowedAgentTypes,
          type: filteredChanges.agentType
        })
      }

      await this.agentsService.update(agentId, filteredChanges);

      res.status(200).json({ message: "updated" });
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

     const resource = await this.agentsService.resource(agentId);
      if (!resource) {
        throw new NotFoundError(undefined, {
          block: `${block}.notFound`,
        });
      }

      if(resource.userId !== user.user_id) {
        throw new AuthorizationError(undefined, {
          block: `${block}.userCheck`,
          workspaceUserId: resource.userId,
          userId: user.user_id
        })
      }

      await this.agentsService.delete(agentId);
      res.status(200).json({ message: "Agent deleted"})
    } catch (error) {
      throw error;
    }
  }
}
