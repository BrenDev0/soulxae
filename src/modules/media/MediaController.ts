import { Request, Response } from "express";
import HttpService from "../../core/services/HttpService"
import { AuthorizationError, BadRequestError, NotFoundError } from "../../core/errors/errors";
import S3Service from "./S3Service";
import Container from "../../core/dependencies/Container";
import AgentsService from "../agents/AgentsService";
import axios from "axios";

export default class MediaController { 
  private httpService: HttpService;
  private s3Service: S3Service;  
  private block = "media.controller"; 
  

  constructor(httpService: HttpService, s3Service: S3Service) {
    this.httpService = httpService;
    this.s3Service = s3Service
  }

  async uploadReferenceDocs(req: Request, res: Response): Promise<void> {
    const block = `${this.block}.createRequest`;
    try {
      const file = req.file;
      if(!file) {
        throw new BadRequestError("All fields required", {
          block: block,
          reason: "No file in request"
        })
      }

      const user = req.user;

      const agentId = req.params.agentId;
      this.httpService.requestValidation.validateUuid(agentId, "agentId", block)

      const agentService = Container.resolve<AgentsService>("AgentsService");
      const agentResource = await agentService.resource(agentId);
      if(!agentResource) {
        throw new NotFoundError("No agent found")
      }

      if(agentResource.userId !== user.user_id) {
        throw new AuthorizationError()
      }

      const key = `temp_for_ empbeding:${user.user_id}:${agentId}`

      const url = await this.s3Service.upload(key, file!)

      const token = this.httpService.webtokenService.generateToken({
        userId: user.user_id
      }, "2m")

      const response = await axios.post(
        "https://soulxae-agent.up.railway.app/api/files/upload",
        {
          agent_id: agentId,
          s3_key: key,
          file_type: file?.mimetype,
          filename: file?.originalname
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log("response::::::::::", response)

      await this.s3Service.delete(key)

      res.status(200).json({ message: "File added to agent references." });
    } catch (error) {
      console.log("MEDIAUPLOAD ERROR::::::::::", error)
      throw error;
    }
  }

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
  //    const resource = await this.mediaService.resource(user.user_id);
  //     if (!resource) {
  //       throw new NotFoundError(undefined, {
  //         block: `${block}.notFound`,
  //       });
  //     }
  //     const allowedChanges = [""];

  //     const filteredChanges = this.htttpService.requestValidation.filterUpdateRequest<MediaData>(allowedChanges, req.body, block);

  //     await this.mediaService.update(filteredChanges);

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
