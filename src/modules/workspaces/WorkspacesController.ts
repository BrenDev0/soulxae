import { Request, Response } from "express";
import HttpService from "../../core/services/HttpService"
import { AuthorizationError, BadRequestError, NotFoundError } from "../../core/errors/errors";
import WorkspacesService from "./WorkspacesService";
import { WorkspaceData } from "./workspaces.interface";

export default class WorkspacesController { 
  private workspacesService: WorkspacesService;  
  private block = "workspaces.controller"; 
  private httpService: HttpService;

  constructor(httpService: HttpService, workspacesService: WorkspacesService) {
    this.workspacesService = workspacesService;
    this.httpService = httpService;
  }

  async createRequest(req: Request, res: Response): Promise<void> {
    const block = `${this.block}.createRequest`;
    try {
      const user = req.user;
      const requiredFields = ["name"];
      this.httpService.requestValidation.validateRequestBody(requiredFields, req.body, block);

      const workspaceData = {
        ...req.body,
        userId: user.user_id
      };

      await this.workspacesService.create(workspaceData);

      res.status(200).json({ message: "Workspace added." });
    } catch (error) {
      throw error;
    }
  }

  async resourceRequest(req: Request, res: Response): Promise<void> {
    const block = `${this.block}.resourceRequest`;
    try {
      const user = req.user;
      const workspaceId = req.params.workspaceId;
      this.httpService.requestValidation.validateUuid(workspaceId, "workspaceId", block);

      const resource = await this.workspacesService.resource(workspaceId);
      if(!resource) {
        throw new NotFoundError(undefined, {
          block: `${block}.resouceCheck`,
          resource: resource || `No workspace found in de with id: ${workspaceId}`
        })
      }

      if(resource.userId !== user.user_id) {
        throw new AuthorizationError(undefined, {
          block: `${block}.userCheck`,
          resourceUserId: resource.userId,
          user: user.user_id
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
      const user = req.user;
      
      const data = await this.workspacesService.collection(user.user_id);

      res.status(200).json({ data: data })
    } catch (error) {
      throw error;
    }
  }
 

  async updateRequest(req: Request, res: Response): Promise<void> {
    const block = `${this.block}.updateRequest`;
    try { 
      const user = req.user;
      const workspaceId = req.params.workspaceId;

      this.httpService.requestValidation.validateUuid(workspaceId, "workspaceId", block);

      const resource = await this.workspacesService.resource(workspaceId);
      if (!resource) {
        throw new NotFoundError(undefined, {
          block: `${block}.notFound`,
        });
      }

       if(resource.userId !== user.user_id) {
        throw new AuthorizationError(undefined, {
          block: `${block}.userCheck`,
          resourceUserId: resource.userId,
          user: user.user_id
        })
      }

      const allowedChanges = ["name"];

      const filteredChanges = this.httpService.requestValidation.filterUpdateRequest<WorkspaceData>(allowedChanges, req.body, block);

      await this.workspacesService.update(workspaceId, filteredChanges);

      res.status(200).json({ message: "workspace updated" });
    } catch (error) {
      throw error;
    }
  }

  async deleteRequest(req: Request, res: Response): Promise<void> {
    const block = `${this.block}.deleteRequest`;
    try {
      const user = req.user;
      const workspaceId = req.params.workspaceId;

      this.httpService.requestValidation.validateUuid(workspaceId, "workspaceId", block);

      const resource = await this.workspacesService.resource(workspaceId);
      if (!resource) {
        throw new NotFoundError(undefined, {
          block: `${block}.notFound`,
        });
      }

       if(resource.userId !== user.user_id) {
        throw new AuthorizationError(undefined, {
          block: `${block}.userCheck`,
          resourceUserId: resource.userId,
          user: user.user_id
        })
      }

      await this.workspacesService.delete(workspaceId);
      res.status(200).json({ message: "Workspace deleted"})
    } catch (error) {
      throw error;
    }
  }
}
