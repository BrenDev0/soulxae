import express, { Request, Response } from 'express';
export default class WhatsappController {
    // async verifyWebhook(req: Request, res: Response): Promise<any> {
    //     try {
    //         const pool = await databaseInstance.getPool()
    //         const platformsService = new PlatformsServic(pool);
    //         const encryptor = new Encryptor();
    //         const agentId = encryptor.decryptData(req.params.id);
    //         const agent = await platformsService.resource(parseInt(agentId), 'whatsapp')
            
    //         // Parse params from the webhook verification request
    //         let mode = req.query['hub.mode']
    //         let token = req.query['hub.verify_token']
    //         let challenge = req.query['hub.challenge']
        
    //         // Check if a token and mode were sent
    //         if (mode && token) {
    //         if(!agent || agent.webhook_secret === null) {
    //             console.log("no agent")
    //             return res.status(500).json({"message": "Agent config error"})
    //         }
    //         const decryptedWebhookSecret = encryptor.decryptData(agent.webhook_secret)
        
    //         if (
    //             (mode === 'subscribe' && token === decryptedWebhookSecret)
    //         ) {
    //             // Respond with 200 OK and challenge token from the request
    //             console.log('WEBHOOK_VERIFIED')
    //             res.status(200).send(challenge)
    //         } else {
    //             // Responds with '403 Forbidden' if verify tokens do not match
    //             res.sendStatus(403)
    //         }
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }
}