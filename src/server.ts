import { Request, Response } from 'express';
import createApp from './createApp';
import swaggerUi from 'swagger-ui-express';
import swaggerFile from './core/swagger/swagger.json';
import { configureContainer } from './core/dependencies/configureContainer';
import Container from './core/dependencies/Container';
import MiddlewareService from './core/middleware/MiddlewareService';
import { initializeAgentsRouter } from './modules/agents/agents.routes';
import { initializePlatformsRouter } from './modules/platforms/platforms.routes';
import { initializeUsersRouter } from './modules/users/users.routes';
import { initializeWorkspacesRouter } from './modules/workspaces/workspaces.routes';
import { initializeDirectMessageingRouter } from './modules/directMessaging/directMessaging.routes';
import { initializeClientsRouter } from './modules/clients/clients.routes';
import { initializeConversationsRouter } from './modules/conversations/conversations.routes';
import { initializeWhatsappRouter } from './modules/whatsapp/whatsapp.routes';


const server = async() => {
    const app = createApp();
    await configureContainer();

    const middlewareService: MiddlewareService =  Container.resolve("MiddlewareService");

    // routers //
    const agentsRouter = initializeAgentsRouter();
    const clientsRouter = initializeClientsRouter();
    const conversationsRouter = initializeConversationsRouter();
    const directMessagingRouter = initializeDirectMessageingRouter();
    const platformsRouter = initializePlatformsRouter();
    const usersRouter = initializeUsersRouter();
    const whatsappRouter = initializeWhatsappRouter();
    const workspacesRouter = initializeWorkspacesRouter();

   
    
    // Routes //
    process.env.NODE_ENV === "production" && app.use(middlewareService.verifyHMAC);
    process.env.NODE_ENV !== 'production' && app.use('/docs/endpoints', swaggerUi.serve, swaggerUi.setup(swaggerFile));

    app.use("/agents", agentsRouter);
    app.use("/clients", clientsRouter);
    app.use("/conversatations", conversationsRouter);
    app.use("/direct", directMessagingRouter);
    app.use("/platforms", platformsRouter);
    app.use("/users", usersRouter);
    app.use("/whatsapp", whatsappRouter);
    app.use("/workspaces", workspacesRouter)

    app.use((req: Request, res: Response) => {
        res.status(404).json({ message: "Route not found." });
    });

    app.use(middlewareService.handleErrors.bind(middlewareService))


    const PORT = process.env.SERVER_PORT || 3000
    app.listen(PORT, () => {
        console.log("online");
    });
}

server();

