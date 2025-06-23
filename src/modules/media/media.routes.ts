import { Router } from 'express';
import Container from '../../core/dependencies/Container';
import MiddlewareService from '../../core/middleware/MiddlewareService';
import MediaController from './MediaController';
import multer from 'multer';

export const initializeMediaRouter = (customController?: MediaController) => {
    const router = Router();
    const secureRouter = Router();
    const storage = multer.memoryStorage();
    const upload = multer({ storage });
    const middlewareService = Container.resolve<MiddlewareService>("MiddlewareService");
    const controller = customController ?? Container.resolve<MediaController>("MediaController");

    secureRouter.use(middlewareService.auth.bind(middlewareService));

    // protected Routes //
    secureRouter.post("/upload/files/:agentId", upload.single("file"),
          /*
        #swagger.tags = ['Media']
        #swagger.path =  '/media/secure/upload/files/{agentId}'
        #swagger.security = [{ "bearerAuth": [] }] 
        #swagger.description = 'Upload agent reference docs'
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: { $ref: "#/components/schemas/uploadAgentDocs" }
                }
            }
        }
        */
        controller.uploadReferenceDocs.bind(controller)
    )

  

    // mounts //

    router.use("/secure", secureRouter);

    console.log("Media router initialized.");
    return router;
}
