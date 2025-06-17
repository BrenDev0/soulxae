import { Router } from 'express';
import Container from '../../core/dependencies/Container';
import MiddlewareService from '../../core/middleware/MiddlewareService';
import EmployeesController from './EmployeesController';

export const initializeEmployeesRouter = (customController?: EmployeesController) => {
    const router = Router();
    const secureRouter = Router();
    const adminOnlyRouter = Router();
    const middlewareService = Container.resolve<MiddlewareService>("MiddlewareService");
    const controller = customController ?? Container.resolve<EmployeesController>("EmployeesController");

    secureRouter.use(middlewareService.auth.bind(middlewareService));
    adminOnlyRouter.use(middlewareService.adminCheck)

    // protected Routes //
    adminOnlyRouter.post("/create", 
         /*
        #swagger.tags = ['Employees']
        #swagger.path =  '/employees/secure/create'
        #swagger.security = [{ "bearerAuth": [] }] 
        #swagger.description = 'create employee'
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: { $ref: "#/components/schemas/createEmployee" }
                }
            }
        }
        */
        controller.createRequest.bind(controller)
    )

    adminOnlyRouter.get("/resource/:employeeId", 
        /*
        #swagger.tags = ['Employees']
        #swagger.path =  '/employees/secure/resource/{employeeId}'
        #swagger.security = [{ "bearerAuth": [] }] 
        #swagger.description = 'get employee by id'
        */
        controller.resourceRequest.bind(controller)
    )

    adminOnlyRouter.get("/collection/:agentId", 
        /*
        #swagger.tags = ['Employees']
        #swagger.path =  '/employees/secure/collection/{agentId}'
        #swagger.security = [{ "bearerAuth": [] }] 
        #swagger.description = 'get employees by agent'
        */
        controller.collectionRequest.bind(controller)
    )

    adminOnlyRouter.put("/:employeeId", 
         /*
        #swagger.tags = ['Employees']
        #swagger.path =  '/employees/secure/{employeeId}'
        #swagger.security = [{ "bearerAuth": [] }] 
        #swagger.description = 'update employee'
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: { $ref: "#/components/schemas/updateEmployee" }
                }
            }
        }
        */
        controller.updateRequest.bind(controller)
    )

    adminOnlyRouter.delete("/:employeeId", 
        /*
        #swagger.tags = ['Employees']
        #swagger.path =  '/employees/secure/{employeeId}'
        #swagger.security = [{ "bearerAuth": [] }] 
        #swagger.description = 'delete employee by id'
        */
        controller.deleteRequest.bind(controller)
    )

  

    // mounts //
    secureRouter.use(adminOnlyRouter)
    router.use("/secure", secureRouter);

    console.log("Employees router initialized.");
    return router;
}
