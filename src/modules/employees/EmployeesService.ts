import { Employee, EmployeeData } from './employees.interface'
import BaseRepository from "../../core/repository/BaseRepository";
import { handleServiceError } from '../../core/errors/error.service';
import Container from '../../core/dependencies/Container';
import EncryptionService from '../../core/services/EncryptionService';

export default class EmployeesService {
    private repository: BaseRepository<Employee>;
    private block = "employees.service"
    constructor(repository: BaseRepository<Employee>) {
        this.repository = repository
    }

    async create(employees: EmployeeData): Promise<Employee> {
        const mappedEmployee = this.mapToDb(employees);
        try {
            return this.repository.create(mappedEmployee);
        } catch (error) {
            handleServiceError(error as Error, this.block, "create", mappedEmployee)
            throw error;
        }
    }

    async resource(employeeId: string): Promise<EmployeeData | null> {
        try {
            const result = await this.repository.selectOne("employee_id", employeeId);
            if(!result) {
                return null
            }
            return this.mapFromDb(result)
        } catch (error) {
            handleServiceError(error as Error, this.block, "resource", {employeeId})
            throw error;
        }
    }

    async collection(agentId: string): Promise<EmployeeData[]> {
        try {
            const result = await this.repository.select("agent_id", agentId);
         
            return result.map((employee) => this.mapFromDb(employee))
        } catch (error) {
            handleServiceError(error as Error, this.block, "collection", {agentId})
            throw error;
        }
    }

    

    async update(employeeId: string, changes: EmployeeData): Promise<Employee> {
        const mappedChanges = this.mapToDb(changes);
        const cleanedChanges = Object.fromEntries(
            Object.entries(mappedChanges).filter(([_, value]) => value !== undefined)
        );
        try {
            return await this.repository.update("employee_id", employeeId, cleanedChanges);
        } catch (error) {
            handleServiceError(error as Error, this.block, "update", cleanedChanges)
            throw error;
        }
    }

    async delete(employeeId: string): Promise<Employee> {
        try {
            return await this.repository.delete("employee_id", employeeId) as Employee;
        } catch (error) {
            handleServiceError(error as Error, this.block, "delete", {employeeId})
            throw error;
        }
    }

    mapToDb(employee: EmployeeData): Employee {
        const encryptionService = Container.resolve<EncryptionService>("EncryptionService");
        return {
            agent_id: employee.agentId,
            user_id: employee.userId
        }
    }

    mapFromDb(employee: Employee): EmployeeData {
        const encryptionService = Container.resolve<EncryptionService>("EncryptionService");
        return {
            employeeId: employee.employee_id,
            agentId: employee.agent_id,
            userId: employee.user_id,
            name: employee.name && encryptionService.decryptData(employee.name),
            email: employee.email && encryptionService.decryptData(employee.email),
            password: employee.password && encryptionService.decryptData(employee.password)
        }
    }
}
