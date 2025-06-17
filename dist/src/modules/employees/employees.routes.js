"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeEmployeesRouter = void 0;
const express_1 = require("express");
const Container_1 = __importDefault(require("../../core/dependencies/Container"));
const initializeEmployeesRouter = (customController) => {
    const router = (0, express_1.Router)();
    const secureRouter = (0, express_1.Router)();
    const adminOnlyRouter = (0, express_1.Router)();
    const middlewareService = Container_1.default.resolve("MiddlewareService");
    const controller = customController !== null && customController !== void 0 ? customController : Container_1.default.resolve("EmployeesController");
    secureRouter.use(middlewareService.auth.bind(middlewareService));
    adminOnlyRouter.use(middlewareService.adminCheck);
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
    controller.createRequest.bind(controller));
    adminOnlyRouter.get("/resource/:employeeId", 
    /*
    #swagger.tags = ['Employees']
    #swagger.path =  '/employees/secure/resource/{employeeId}'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.description = 'get employee by id'
    */
    controller.resourceRequest.bind(controller));
    adminOnlyRouter.get("/collection/:agentId", 
    /*
    #swagger.tags = ['Employees']
    #swagger.path =  '/employees/secure/collection/{agentId}'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.description = 'get employees by agent'
    */
    controller.collectionRequest.bind(controller));
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
    controller.updateRequest.bind(controller));
    adminOnlyRouter.delete("/:employeeId", 
    /*
    #swagger.tags = ['Employees']
    #swagger.path =  '/employees/secure/{employeeId}'
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.description = 'delete employee by id'
    */
    controller.deleteRequest.bind(controller));
    // mounts //
    secureRouter.use(adminOnlyRouter);
    router.use("/secure", secureRouter);
    console.log("Employees router initialized.");
    return router;
};
exports.initializeEmployeesRouter = initializeEmployeesRouter;
