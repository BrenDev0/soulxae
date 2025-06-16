import { Request, Response } from "express";
import HttpService from "../../core/services/HttpService"
import { AuthorizationError, BadRequestError, NotFoundError } from "../../core/errors/errors";
import AgenciesService from "./AgenciesService";
import { AgencyData } from "./agencies.interface";

export default class AgenciesController { 
  private httpService: HttpService;
  private agenciesService: AgenciesService;  
  private block = "agencies.controller"; 
  

  constructor(httpService: HttpService, agenciesService: AgenciesService) {
    this.httpService = httpService;
    this.agenciesService = agenciesService;
  }

  // async createRequest(req: Request, res: Response): Promise<void> {
  //   const block = `${this.block}.createRequest`;
  //   try {
  //     const  user = req.user;
  //     const requiredFields = ["name", "branding", ];


  //     const agencyData = {
    
  //     };

  //     await this.agenciesService.create(agencyData);

  //     res.status(200).json({ message: " added." });
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async resourceRequest(req: Request, res: Response): Promise<void> {
    const block = `${this.block}.resourceRequest`;
    try {
      
    } catch (error) {
      throw error;
    }
  }

  async updateRequest(req: Request, res: Response): Promise<void> {
    const block = `${this.block}.updateRequest`;
    try { 
      const user = req.user;
      const agencyId = req.params.agencyId;
      this.httpService.requestValidation.validateUuid(agencyId, "agencyId", block);

     const resource = await this.agenciesService.resource(agencyId);
      if (!resource) {
        throw new NotFoundError(undefined, {
          block: `${block}.notFound`,
        });
      }

      if(resource.userId !== user.user_id) {
        if(resource.userId !== user.user_id) {
                throw new AuthorizationError(undefined, {
                  block: `${block}.userCheck`,
                  agencyUserId: resource.userId,
                  userId: user.user_id
                })
              }
      }
      const allowedChanges = ["name", "branding", "loginUrl", "mainWebsiteUrl", "supportEmail", "termsOfService", "privacyPolicy"];

      const filteredChanges = this.httpService.requestValidation.filterUpdateRequest<AgencyData>(allowedChanges, req.body, block);

      await this.agenciesService.update(agencyId, filteredChanges);

      res.status(200).json({ message: "updated" });
    } catch (error) {
      throw error;
    }
  }

  async deleteRequest(req: Request, res: Response): Promise<void> {
    const block = `${this.block}.deleteRequest`;
    try {
     
    } catch (error) {
      throw error;
    }
  }
}
