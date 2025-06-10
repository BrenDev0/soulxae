// import twilio from 'twilio';
// import { Request, Response } from 'express';
// import { TwilioTemplate } from '../interface/app';
// import Whatsapp from '../class/Whatsappp';
// import Messenger from '../class/Messenger';
// import Redis from '../class/Redis';
// import { Message } from '../interface/models/conversations';
// import ConversationsService from '../services/ConversationsService';
// import VoiceflowService from '../services/VoiceflowService';
// import Controller from '../class/Controller';

// class InteractionsController{
//     private redis: Redis;
//     private redisKey: string;
//     private state: any;
//     private twilioClient;
//     private whatsapp: any
//     private messenger: any
//     private conversationsService: ConversationsService;
//     private VoiceflowService: VoiceflowService; 
//     private refreshState: boolean;
    
//     constructor(conversationsService: ConversationsService, voiceflowService: VoiceflowService) {
//       this.redis = new Redis();
//       this.twilioClient = twilio(process.env.TWILIO_ACCOUNT_ID, process.env.TWILIO_AUTH_TOKEN)
//       this.conversationsService = conversationsService;
//       this.VoiceflowService = voiceflowService;
//       this.refreshState = true;
//       this.redisKey = ""
//     }

//     public async interact(req: Request, res: Response): Promise<void> {
//         const { redisKey, webhook } = req.body;

//         if(!redisKey || !webhook) {
//           res.status(400).json({ message: this.response400 });
//           return; 
//         }
        
//         const state = await this.redis.get(redisKey);
//         if(!state) {
//           res.status(500).json({ message: "Session error." });
//           return; 
//         }
//         this.redisKey = redisKey;
//         this.state = JSON.parse(state);
        
//         // check for agent handoff 
//         if(this.state.conversation.handoff) {
//           res.status(200).send();
//           return; 
//         }
       
//         try {
//           let messages = [];

//           if(this.state.agent.provider === 'voiceflow'){
//             messages = await this.VoiceflowService.interact(this.state);
//           } else {
//             res.status(400).json({ message: "Flow provider not supported." });
//             return; 
//           }

//           if (messages.length === 0) {
//             throw new Error("No message or buttons to send");
//           }

//           switch(webhook){
//             case "twilio":
//               await this.sendTwilioMessage(messages);
//               break;
//             case "whatsapp":
//               this.whatsapp = new Whatsapp(this.conversationsService, this.redisKey);
//               await this.sendWhatsappMessage(messages);
//               break;
//             case "messenger":
//               this.messenger = new Messenger(this.conversationsService, this.redisKey);
//               await this.sendMessengerMessage(messages);
//               break;
//             case "instagram":
//               this.messenger = new Messenger(this.conversationsService, this.redisKey);
//               await this.sendMessengerMessage(messages); 
//               break;
//             default:
//               res.status(500).json({ message: "Invalid webhook" });
//               return; 
//           }

//           res.status(200).json({ message: "sent" });
//         } catch (error) {
//             console.log(error);
//             res.status(500).json({ message: this.response500 });
//         }

//     }

//     private async sendWhatsappMessage(messages: Record<string, any> ): Promise<void> {
//       if (!Array.isArray(messages) || messages.length === 0) {
//         return;
//       }

//       for(let i = 0; i < messages.length; i++) {
//         const message = messages[i];
//         const nextMessage =  messages[i + 1];

//         if(message.text && (!nextMessage || nextMessage?.text || !nextMessage.buttons)) {
//           await this.whatsapp.simpleMessage(message)
//           continue;
//         } else if(message.text && nextMessage?.buttons) {
//           await this.whatsapp.waButtonsMessage([message.text, nextMessage.buttons]);
//           return;
//         } else if(message.cardV2) {
//           await this.whatsapp.waCardMessage(message.cardV2);
//           continue;
//         } else if(message.visual) {
//           await this.whatsapp.waImageMessage(message.visual);
//           await new Promise((resolve) => setTimeout(resolve, 2000))
//           continue;
//         } else if(message.end) {
//           await this.redis.delete(this.redisKey);
//           console.log("Session deleted")
//         }
//       }
//       return;
//     }

//     private async sendMessengerMessage(messages: Record<string, any>): Promise<void> {
//       if (!Array.isArray(messages) || messages.length === 0) {
//         return;
//       }
      
//       for(let i = 0; i < messages.length; i++) {
//         const message = messages[i];
//         const nextMessage =  messages[i + 1];

//         if(message.text && (!nextMessage || nextMessage?.text || !nextMessage.buttons)) {
//           await this.messenger.simpleMessage(message);
//           continue;
//         } else if(message.text && nextMessage?.buttons) {
//           await this.messenger.buttonsMessage([message.text, nextMessage.buttons]);
//           return;
//         } else if(message.cardV2) {
//           await this.messenger.cardMessage(message.cardV2);
//           continue;
//         } else if(message.visual) {
//           await this.messenger.imageMessage(message.visual);
//           await new Promise((resolve) => setTimeout(resolve, 2000))
//           continue;
//         } else if(message.end) {
//           await this.redis.delete(this.redisKey);
//           console.log("Session deleted")
//         }
//       }
//       return;
//     }

//     private async sendTwilioMessage(messages: Record<string, any>): Promise<void> {
//       let messageOptions: TwilioTemplate = {
//         to: `whatsapp:${this.state.client.contact_identifier}`,
//         from: this.state.agent.phone
//       };

//       let messageVariables: { [key: string]: string } = {};
        
//       for(let i = 0; i < messages.length; i++) {
//           const message = messages[i];
//           const nextMessage = messages[i + 1];
  
//           if(message.text && (!nextMessage || nextMessage?.text || !nextMessage.buttons)) {
//             try {
//               const agentReply: Message = {
//                 conversation_id: this.state.conversationId,
//                 sender: this.state.agent.name,
//                 content: {
//                   header: "",
//                   body: message.text,
//                   footer: "",
//                   buttons: []
//                 },
//                 type: "agent"
//               }
//               await this.twilioClient.messages.create({
//                 to: `whatsapp:${this.state.client.contact_identifier}`,
//                 from: this.state.agent.phone,
//                 body: message.text
//               })
//               await this.conversationsService.createMessage(agentReply);
//               continue;
//             } catch (error) {
//               console.log(error);
//               throw error
//             }
//           } else if(message.text && nextMessage?.buttons) {
//             messageVariables.body = message.text;
//           } else if (message.buttons) {
//             switch(message.buttons.length){
//               case 2:
//                 messageOptions.contentSid = process.env.TWO_BUTTONS;
//                 break;
//               case 3: 
//                 messageOptions.contentSid = process.env.THREE_BUTTONS;  
//                 break;
//               case 4: 
//                 messageOptions.contentSid = process.env.FOUR_BUTTONS;
//                 break;
//               default:
//                 throw new Error("Cannot send more than 4 buttons");
//             }
//             for (let i = 0; i < message.buttons.length; i++) {
//               console.log("button request:::::", message.buttons[i].request)
//               if(!this.state[message.buttons[i].name.toUpperCase()]) {
//                 this.state[message.buttons[i].name.toUpperCase()] = message.buttons[i].request
//                 console.log("this.stae::::::", this.state[message.buttons[i].name.toUpperCase()])
//               }
//               messageVariables[`button${i + 1}`] = message.buttons[i].name;
//             }
//             await this.redis.set(this.redisKey, JSON.stringify(this.state));
//             messageOptions.contentVariables = JSON.stringify(messageVariables);

//             const twilioPromise = this.twilioClient.messages.create(messageOptions);
          
//             const agentReply: Message = {
//               conversation_id: this.state.conversationId,
//               sender: this.state.agent.phone,
//               content:  {
//                 header: "TWILIO TEMPLATE",
//                 body: messageOptions.contentSid || "TWILIO SID",
//                 footer: "",
//                 buttons: []
//               },
//                type: "agent"
//             }
//             await twilioPromise;
//             console.log("sent buttons")
//             await this.conversationsService.createMessage(agentReply);
//             return;
//           } else if(message.end) {
//             this.refreshState = false
//             await this.redis.delete(this.redisKey);
//             console.log("Session deleted");
//             return;
//           }

//         }   
        
//         if(this.refreshState) {
//           await this.redis.set(this.redisKey, JSON.stringify(this.state)) 
//         }
      
//       return;
//     }
// }

// export default InteractionsController;