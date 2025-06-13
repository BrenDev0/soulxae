import { Request, Response } from "express";
import HttpService from "../../core/services/HttpService"
import { BadRequestError, NotFoundError } from "../../core/errors/errors";
import MediaService from "./MediaService";
import { MediaData } from "./media.interface";

export default class MediaController { 
  private httpService: HttpService;
  private mediaService: MediaService;  
  private block = "media.controller"; 
  

  constructor(httpService: HttpService, mediaService: MediaService) {
    this.httpService = httpService;
    this.mediaService = mediaService;
  }

  // async createRequest(req: Request, res: Response): Promise<void> {
  //   const block = `${this.block}.createRequest`;
  //   try {
  //     const requiredFields = [""];


  //     const mediaData = {
    
  //     };

  //     await this.mediaService.create(mediaData);

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
