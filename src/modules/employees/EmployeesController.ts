import { Request, Response } from "express";
import HttpService from "../../core/services/HttpService"
import { BadRequestError, DatabaseError, NotFoundError } from "../../core/errors/errors";
import EmployeesService from "./EmployeesService";
import { EmployeeData } from "./employees.interface";
import Container from "../../core/dependencies/Container";
import UsersService from "../users/UsersService";
import { agent } from "supertest";

export default class EmployeesController { 
  private httpService: HttpService;
  private employeesService: EmployeesService;  
  private block = "employees.controller"; 
  

  constructor(httpService: HttpService, employeesService: EmployeesService) {
    this.httpService = httpService;
    this.employeesService = employeesService;
  }

  async createRequest(req: Request, res: Response): Promise<void> {
    const block = `${this.block}.createRequest`;
    try {
      const requiredFields = ["name", "email", "agentId"];
      this.httpService.requestValidation.validateRequestBody(requiredFields, req.body, block);

      const password = this.httpService.passwordService.generateRandomPassword(13);

      const userData = {
        ...req.body,
        password: this.httpService.encryptionService.encryptData(password)
      };

      const usersService = Container.resolve<UsersService>("UsersService");
      const newUser = await usersService.create(userData);

      if(!newUser || !newUser.user_id) {
        throw new DatabaseError("Error creating employee")
      }

      const employeeData: EmployeeData = {
        userId: newUser.user_id,
        agentId: req.body.agentId
      }
      await this.employeesService.create(employeeData);

      res.status(200).json({ message: "Employee added"  });
    } catch (error) {
      throw error;
    }
  }

  async resourceRequest(req: Request, res: Response): Promise<void> {
    const block = `${this.block}.resourceRequest`;
    try {
      const employeeId = req.params.employeeId;
      this.httpService.requestValidation.validateUuid(employeeId, "employeeId", block);

      const resource = await this.httpService.requestValidation.validateResource<EmployeeData>(employeeId, "EmployeesService", "Employee not found", block)

      res.status(200).json({ data: resource })
    } catch (error) {
      throw error;
    }
  }

  async collectionRequest(req: Request, res: Response): Promise<void> {
    const block = `${this.block}.collectionRequest`;
    try {
      const agentId = req.params.agentId;
      this.httpService.requestValidation.validateUuid(agentId, "agentId", block);

      const data = await this.employeesService.collection(agentId);

      res.status(200).json({ data: data })
    } catch (error) {
      throw error;
    }
  }

  async updateRequest(req: Request, res: Response): Promise<void> {
    const block = `${this.block}.updateRequest`;
    try { 
     const employeeId = req.params.employeeId;
      this.httpService.requestValidation.validateUuid(employeeId, "employeeId", block);

      await this.httpService.requestValidation.validateResource<EmployeeData>(employeeId, "EmployeesService", "Employee not found", block)
      const allowedChanges = ["name"];

      const filteredChanges = this.httpService.requestValidation.filterUpdateRequest<EmployeeData>(allowedChanges, req.body, block);

      await this.employeesService.update(employeeId, filteredChanges);

      res.status(200).json({ message: "Employee updated" });
    } catch (error) {
      throw error;
    }
  }

  async deleteRequest(req: Request, res: Response): Promise<void> {
    const block = `${this.block}.deleteRequest`;
    try {
     const employeeId = req.params.employeeId;
      this.httpService.requestValidation.validateUuid(employeeId, "employeeId", block);

      await this.httpService.requestValidation.validateResource<EmployeeData>(employeeId, "EmployeesService", "Employee not found", block)

      await this.employeesService.delete(employeeId);
    } catch (error) {
      throw error;
    }
  }
}
