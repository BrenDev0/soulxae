import { Request, Response } from "express";
import HttpService from "../../core/services/HttpService"
import { BadRequestError, NotFoundError } from "../../core/errors/errors";
import CalendarsService from "./CalendarsService";
import { CalendarData } from "./calendars.interface";

export default class CalendarsController { 
  private httpService: HttpService;
  private calendarsService: CalendarsService;  
  private block = "calendars.controller"; 
  

  constructor(httpService: HttpService, calendarsService: CalendarsService) {
    this.httpService = httpService;
    this.calendarsService = calendarsService;
  }

  async createRequest(req: Request, res: Response): Promise<void> {
    const block = `${this.block}.createRequest`;
    try {
      const user = req.user;

      const requiredFields = ["calendarReferenceId"];

      this.httpService.requestValidation.validateRequestBody(requiredFields, req.body, block);

      const calendarData: Omit<CalendarData, "calendarId"> = {
        ...req.body,
        userId: user.user_id
      };

      await this.calendarsService.create(calendarData);

      res.status(200).json({ message: "Calendar added" });
    } catch (error) {
      throw error;
    }
  }

  async resourceRequest(req: Request, res: Response): Promise<void> {
    const block = `${this.block}.resourceRequest`;
    try {
      const  user = req.user;
      
      const calendarId = req.params.calendarId;
      this.httpService.requestValidation.validateUuid(calendarId, "CalendarId", block);

      const calendarResource = await this.httpService.requestValidation.validateResource<CalendarData>(calendarId, "CalendarsService", "Calendar not found", block);
      this.httpService.requestValidation.validateActionAuthorization(user.user_id, calendarResource.userId, block);

      res.status(200).json({ data: calendarResource })
    } catch (error) {
      throw error;
    }
  }


  async collectionRequest(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user;

      const data = await this.calendarsService.collection(user.user_id);

      res.status(200).json({ data: data })
    } catch (error) {
      throw error
    }
  }

  async deleteRequest(req: Request, res: Response): Promise<void> {
    const block = `${this.block}.deleteRequest`;
    try {
     const user = req.user;
     
     const calendarId = req.params.calendarId;
     this.httpService.requestValidation.validateUuid(calendarId, "CalendarId", block);

     const calendarResource = await this.httpService.requestValidation.validateResource<CalendarData>(calendarId, "CalendarsService", "Calendar not found", block);
     this.httpService.requestValidation.validateActionAuthorization(user.user_Id, calendarResource.userId, block);

     await this.calendarsService.delete(calendarResource.calendarId);

     res.status(200).json({ message: "Calendar deleted" })
    } catch (error) {
      throw error;
    }
  }
}
