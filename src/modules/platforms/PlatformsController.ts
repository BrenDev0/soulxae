import { Request, Response } from "express";
import HttpService from "../../core/services/HttpService"
import { AuthorizationError, BadRequestError, NotFoundError } from "../../core/errors/errors";
import PlatformsService from "./PlatformsService";
import { PlatformData } from "./platforms.interface";
import Container from "../../core/dependencies/Container";
import AgenciesService from "../agencies/AgenciesService";

export default class PlatformsController { 
  private httpService: HttpService;
  private platformsService: PlatformsService;  
  private block = "platforms.controller"; 
  private readonly allowedPlatforms =  ["whatsapp", "messenger", "instagram", "direct"]

  constructor(httpService: HttpService, platformsService: PlatformsService) {
    this.httpService = httpService;
    this.platformsService = platformsService;
  }

  async createRequest(req: Request, res: Response): Promise<void> {
    const block = `${this.block}.createRequest`;
    try {
      const requiredFields = ["platform", "token", "identifier"];
      this.httpService.requestValidation.validateRequestBody(requiredFields, req.body, block);

      const user = req.user;

      const agentId = req.params.agentId;
      this.httpService.requestValidation.validateUuid(agentId, "agentId", block)

      const agentsService = Container.resolve<AgenciesService>("AgentsService");
      const agentResourcre =  await agentsService.resource(agentId);
      if(!agentResourcre) {
        throw new BadRequestError("Agent not found")
      }

      if(agentResourcre.userId !== user.user_id) {
        throw new AuthorizationError()
      }
      
      const {  platform, token } = req.body;
      
      if(!this.allowedPlatforms.includes(platform)) {
        throw new BadRequestError("Invalid platform type", {
          allowedPlatforms: this.allowedPlatforms,
          platform: platform
        }) 
      }

      const agentsPlatforms = await this.platformsService.collection(agentId)
      const platformExists = agentsPlatforms.some((i:Record<string, any>) => i.platform == platform)

      if(platformExists) {
          throw new BadRequestError("Platform in use, update or delete agents current platforms") 
      }

      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let secret = '';
      for (let i = 0; i < 13; i++) {
          secret += characters.charAt(Math.floor(Math.random() * characters.length));
      }

  
      const webhookUrl = `https://${process.env.WEBHOOK_URL}/${platform}/${agentId}/webhook`;

      const platformData = {
        ...req.body,
        webhookUrl: webhookUrl,
        webhookSecret: secret
      };

      await this.platformsService.create(platformData);

      res.status(200).json({ 
        message: "Platform added.",
        webhook: webhookUrl,
        secret: secret 
      });
    } catch (error) {
      throw error;
    }
  }

  async resourceRequest(req: Request, res: Response): Promise<void> {
    const block = `${this.block}.resourceRequest`;
    try {
      const platformId = req.params.platformId;

      this.httpService.requestValidation.validateUuid(platformId, "platformId", block);

      const resource = await this.platformsService.resource("platform_id", platformId);
      if (!resource) {
        throw new NotFoundError(undefined, {
          block: `${block}.notFound`,
        });
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

      const data = await this.platformsService.collection(agentId);

      res.status(200).json({ data: data })
    } catch (error) {
      throw error;
    }
  }

  async updateRequest(req: Request, res: Response): Promise<void> {
    const block = `${this.block}.updateRequest`;
    try { 
      const platformId = req.params.platformId;

      this.httpService.requestValidation.validateUuid(platformId, "platformId", block);

      const resource = await this.platformsService.resource("platform_id", platformId);
      if (!resource) {
        throw new NotFoundError(undefined, {
          block: `${block}.notFound`,
        });
      }

      const allowedChanges = ["token", "platform"];

      const filteredChanges = this.httpService.requestValidation.filterUpdateRequest<PlatformData>(allowedChanges, req.body, block);

      if (filteredChanges.platform && !this.allowedPlatforms.includes(filteredChanges.platform)) {
        throw new BadRequestError("Invalid platform type", {
          allowedPlatforms: this.allowedPlatforms,
          platform: filteredChanges.platform
        }) 
      }

      await this.platformsService.update(platformId, filteredChanges);

      res.status(200).json({ message: "updated" });
    } catch (error) {
      throw error;
    }
  }

  async deleteRequest(req: Request, res: Response): Promise<void> {
    const block = `${this.block}.deleteRequest`;
    try {
      const platformId = req.params.platformId;

      this.httpService.requestValidation.validateUuid(platformId, "platformId", block);

      const resource = await this.platformsService.resource("platform_id", platformId);
      if (!resource) {
        throw new NotFoundError(undefined, {
          block: `${block}.notFound`,
        });
      }

      await this.platformsService.delete(platformId);
      res.status(200).json({ message: "Platform deleted"})
    } catch (error) {
      throw error;
    }
  }
}
