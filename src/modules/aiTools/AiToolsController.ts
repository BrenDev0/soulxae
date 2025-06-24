import { Request, Response } from "express";
import HttpService from "../../core/services/HttpService"
import { AuthorizationError, BadRequestError, NotFoundError } from "../../core/errors/errors";
import AiToolsService from "./AiToolsService";
import { AiToolData } from "./aiTools.interface";
import AgentsService from "../agents/AgentsService";

export default class AiToolsController { 
  private httpService: HttpService;
  private aiToolsService: AiToolsService; 
  private agentsService: AgentsService; 
  private block = "aiTools.controller"; 
  

  constructor(httpService: HttpService, aiToolsService: AiToolsService, agentsService: AgentsService) {
    this.httpService = httpService;
    this.aiToolsService = aiToolsService;
    this.agentsService = agentsService
  }

  async createRequest(req: Request, res: Response): Promise<void> {
    const block = `${this.block}.createRequest`;
    try {
      const user = req.user;
      
      const requiredFields = ["agentId", "toolId"];
      this.httpService.requestValidation.validateRequestBody(requiredFields, req.body, block);

      const { agentId, toolId } = req.body;

      const [agentResource, tools] = await Promise.all([
        this.agentsService.resource(agentId),
        this.aiToolsService.read()
      ])
      
      if(!tools.find((tool)=> tool.toolId === toolId)) {
        throw new NotFoundError("Tool not found")
      }

      if(!agentResource) {
        throw new NotFoundError("Agent not found");
      }

      if(agentResource.userId !== user.user_id) {
        throw new AuthorizationError()
      }

      if(agentResource.type !== "ai") {
        throw new BadRequestError("Agent type not compatible with tools", {
          agentType: agentResource.type,
          allowedTypes: "ai"
        })
      }

      await this.aiToolsService.create(agentId, toolId);

      res.status(200).json({ message: "AiTool added to agent config" });
    } catch (error) {
      throw error;
    }
  }

  async getRequest(req: Request, res: Response): Promise<void> {
    const block = `${this.block}.resourceRequest`;
    try {
      const user = req.user;
      const agentId = req.params.agentId;
      this.httpService.requestValidation.validateUuid(agentId, "agentId", block);
      
      if(req.query.resource) {
        const toolId = req.query.resource as string;
        this.httpService.requestValidation.validateUuid(toolId, "toolId", block);

        const data = await this.aiToolsService.resource(agentId, toolId);
        res.status(200).json({ data: data })
        return;
      }

      const data = await this.aiToolsService.collection(agentId);

      res.status(200).json({ data: data })
    } catch (error) {
      throw error;
    }
  }

  async readRequest(req: Request, res: Response): Promise<void> {
    try {
      const data = await this.aiToolsService.read();
      res.status(200).json({ data: data })
    } catch (error) {
      throw error;
    }
  }


  async deleteRequest(req: Request, res: Response): Promise<void> {
    const block = `${this.block}.deleteRequest`;
    try {
      const user = req.user;
      
      const requiredFields = ["agentId", "toolId"];
      this.httpService.requestValidation.validateRequestBody(requiredFields, req.body, block);

      const { agentId, toolId } = req.body;

      const agentResource = await this.agentsService.resource(agentId);
      if(!agentResource) {
        throw new NotFoundError("Agent not found");
      }

      if(agentResource.userId !== user.user_id) {
        throw new AuthorizationError()
      }

      await this.aiToolsService.delete(agentId, toolId); 
      res.status(200).json({ message: "Tool removed from aget config"})
    } catch (error) {
      throw error;
    }
  }
}
