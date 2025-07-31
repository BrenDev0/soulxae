import { Request, Response } from "express";
import HttpService from "../../core/services/HttpService"
import { BadRequestError, NotFoundError } from "../../core/errors/errors";
import SubscriptionsService from "./SubscriptionsService";
import { SubscriptionData } from "./subscriptions.interface";

export default class SubscriptionsController { 
  private httpService: HttpService;
  private subscriptionsService: SubscriptionsService;  
  private block = "subscriptions.controller"; 
  

  constructor(httpService: HttpService, subscriptionsService: SubscriptionsService) {
    this.httpService = httpService;
    this.subscriptionsService = subscriptionsService;
  }

  async createRequest(req: Request, res: Response): Promise<void> {
    const block = `${this.block}.createRequest`;
    try {
      const requiredFields = ["name", "details", "priceMonth", "priceYear", "agencyLimit", "agentLimit"];
      this.httpService.requestValidation.validateRequestBody(requiredFields, req.body, block);

      await this.subscriptionsService.create(req.body);

      res.status(200).json({ message: "Subscription added" });
    } catch (error) {
      throw error;
    }
  }

  async resourceRequest(req: Request, res: Response): Promise<void> {
    const block = `${this.block}.resourceRequest`;
    try {
      const subscriptionId = req.params.subscriptionId;
      this.httpService.requestValidation.validateUuid(subscriptionId, "subscriptionId", block);

      const resource = await this.httpService.requestValidation.validateResource<SubscriptionData>(subscriptionId, "SubscriptionsService", "Subscription not found", block)

      res.status(200).json({ data: resource })
    } catch (error) {
      throw error;
    }
  }

  async updateRequest(req: Request, res: Response): Promise<void> {
    const block = `${this.block}.updateRequest`;
    try { 
      const subscriptionId = req.params.subscriptionId;
      this.httpService.requestValidation.validateUuid(subscriptionId, "subscriptionId", block);

      await this.httpService.requestValidation.validateResource<SubscriptionData>(subscriptionId, "SubscriptionsService", "Subscription not found", block)
      
      const allowedChanges = ["name", "details", "priceMonth", "priceYear", "agencyLimit", "agentLimit"];

      const filteredChanges = this.httpService.requestValidation.filterUpdateRequest<SubscriptionData>(allowedChanges, req.body, block);

      await this.subscriptionsService.update(subscriptionId, filteredChanges);

      res.status(200).json({ message: "Subscription updated" });
    } catch (error) {
      throw error;
    }
  }

  async deleteRequest(req: Request, res: Response): Promise<void> {
    const block = `${this.block}.deleteRequest`;
    try {
      const subscriptionId = req.params.subscriptionId;
      this.httpService.requestValidation.validateUuid(subscriptionId, "subscriptionId", block);

      await this.httpService.requestValidation.validateResource<SubscriptionData>(subscriptionId, "SubscriptionsService", "Subscription not found", block)

      await this.subscriptionsService.delete(subscriptionId);
      
      res.status(200).json({ message: "Subscription deleted" });
    } catch (error) {
      throw error;
    }
  }
}
