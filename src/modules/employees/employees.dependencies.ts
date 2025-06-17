import { Pool } from "pg";
import BaseRepository from "../../core/repository/BaseRepository";
import { Employee } from "./employees.interface";
import EmployeesService from "./EmployeesService";
import EmployeesController from "./EmployeesController";
import Container from "../../core/dependencies/Container";
import HttpService from "../../core/services/HttpService";

export function configureEmployeesDependencies(pool: Pool): void {
    const repository = new BaseRepository<Employee>(pool, "employees");
    const service = new EmployeesService(repository);
    const httpService = Container.resolve<HttpService>("HttpService");
    const controller = new EmployeesController(httpService, service);

    Container.register<EmployeesService>("EmployeesService", service);
    Container.register<EmployeesController>("EmployeesController", controller);
    return;
}
