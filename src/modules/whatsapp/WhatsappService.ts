// import { InteractiveObject, MessageObject } from '../interface/app';
// import axios from 'axios';
// import Redis from './Redis';
// import ConversationsService from '../services/ConversationsService';
// import { Message } from '../interface/models/conversations';


// class Whatsapp {
//   private state: any;
//   private redis: Redis;
//   private redisKey: string;
//   private conversationsService: ConversationsService;
  
    
//   constructor(conversationsService: ConversationsService, redisKey: string) {
//     this.state = null;
//     this.redis = new Redis();
//     this.redisKey = redisKey;
//     this.conversationsService = conversationsService;
//   }

//   async init() {
//     try {
//       if(this.state === null) {
//         const state = await this.redis.get(this.redisKey);
//         this.state = JSON.parse(state)
//       }

//       return;
//     } catch (error) {
//       console.log(error);
//       throw error;
//     }
//   }

//   async send(messageObject: any) {
//     try {
//       if(this.state === null) {
//         await this.init();
//       }
//       await axios.post(
//           `https://graph.facebook.com/${process.env.WHATSAPP_VID}/${this.state.agent.agentid}/messages`,
//           messageObject,
//           {
//             headers: {
//               Authorization: `Bearer ${this.state.agent.token}`,
//             },
//           }
//         );
//         console.log("message sent");
//         return;
//     } catch (error) {
//       throw error;
//     }
//   }

//   async simpleMessage(message: any) {
//     try {
//       await this.init();
//       const agentReply: Message = {
//         conversation_id: this.state.conversation.conversation_id,
//         sender: this.state.agent.name,
//         content: {
//           header: "",
//           body: message.text,
//           footer: "",
//           buttons: []
//         },
//         type: "agent"
//       }

//       const messageData = {
//         messaging_product: "whatsapp",
//         recipient_type: "individual",
//         to: this.state.client.contact_identifier,
//         type: "text",
//         text: {
//           preview_url: true,
//           body: message.text
//         }
//       } 
//       await this.send(messageData);

//       await this.conversationsService.createMessage(agentReply);
//       return;
//     } catch (error) {
//       console.log(error);
//       throw error;
//     }
//   }

//   async waButtonsMessage(data: any[]) {
//     await this.init();
//     const messageBody = data[0];
//     const buttons = data[1];

//     let interactiveObject: InteractiveObject = {
//       type: "",
//       body: {},
//       action: {
//         buttons: []
//       },
//     };

//     let messageObject: MessageObject = {
//       messaging_product: "whatsapp",
//       recipient_type: "individual",
//       to: this.state.client.contact_identifier,
//       type: "",
//     };

//     messageObject.type = "interactive";
//     interactiveObject.type = "button";
//     interactiveObject.body = {
//       text: messageBody
//     };
  
//     if(buttons.length === 1 && buttons[0].request.payload.actions) {
//       if(!this.state[buttons[0].name.toUpperCase()]) {
//         this.state[buttons[0].name.toUpperCase()] = buttons[0].request
//       }
//       interactiveObject.type = "cta_url"
//       interactiveObject.action = {
//         name: "cta_url",
//         parameters: {
//           display_text: buttons[0].name,
//           url: buttons[0].request.payload.actions[0].payload.url
//         }
//       }
//     } else {
//         for(let i = 0; i < buttons.length; i++) {
//           if(!this.state[buttons[i].name.toUpperCase()]) {
//             this.state[buttons[i].name.toUpperCase()] = buttons[i].request
//           }
//           //console.log(message.buttons[i].request.payload.actions) web url fro buttons
//           interactiveObject.action.buttons.push(
//             {
//               type: "reply",
//               reply: {
//                 id: i,
//                 title: buttons[i].name
//               }
//             }
//           )
//         } 
//     }
    
//     messageObject.interactive = interactiveObject;

//     const messageData: Message = {
//       conversation_id: this.state.conversation.conversation_id,
//       sender: this.state.agent.name,
//       content: {
//         header: "",
//         body: interactiveObject.body.text,
//         footer: "",
//         buttons: interactiveObject.action.buttons,
//       },
//        type: "agent"
//     }  

//     await this.conversationsService.createMessage(messageData);

//     await this.redis.set(this.redisKey, JSON.stringify(this.state));

//     await this.send(messageObject);
//     return;
//   }
    
//   async waCardMessage(card: any) {
//     if(this.state === null) {
//       await this.init();
//     }

//     let messageObject: MessageObject = {
//       messaging_product: "whatsapp",
//       recipient_type: "individual",
//       to: this.state.client.contact_identifier,
//       type: "",
//     };

//     messageObject.type = "interactive";
//     let interactiveObject: InteractiveObject = {
//       type: "type",
//       body: {},
//       action: {
//         buttons: []
//       }
//     };
//     if(card.header.length > 0 && card.footer.length >0){
//       interactiveObject = {
//         type: "button",
//         header: {
//           type: "image",
//           image: {
//             link: card.header
//           }
//         },
//         body: {
//           text: card.body
//         },
//         footer: {
//           text: card.footer
//         },
//         action: {
//           buttons: []
//         }
//       }
//     } else if(card.header.length > 0 && card.footer.length < 1) {
//       interactiveObject = {
//         type: "button",
//         header: {
//           type: "image",
//           image: {
//             link: card.header
//           }
//         },
//         body: {
//           text: card.body
//         },
//         action: {
//           buttons: []
//         }
//       }
//     } else if(card.header.length < 1 && card.footer.length > 0) {
//       interactiveObject = {
//         type: "button",
//         body: {
//           text: card.body
//         },
//         footer: {
//           text: card.footer
//         },
//         action: {
//           buttons: []
//         }
//       }
//     }
    
//     if(card.buttons.length === 1 && card.buttons[0].request.payload.actions) {
//       if(!this.state[card.buttons[0].name.toUpperCase()]) {
//         this.state[card.buttons[0].name.toUpperCase()] = card.buttons[0].request
//       }
//       interactiveObject.type = "cta_url"
//       interactiveObject.action = {
//         name: "cta_url",
//         parameters: {
//           display_text: card.buttons[0].name,
//           url: card.buttons[0].request.payload.actions[0].payload.url
//         }
//       }
//     } else {
//       for(let i = 0; i < card.buttons.length; i++) {
//         if(!this.state[card.buttons[i].name.toUpperCase()]) {
//           this.state[card.buttons[i].name.toUpperCase()] = card.buttons[i].request;
//         }
//         //console.log(message.buttons[i].request.payload.actions) web url fro buttons
//         interactiveObject.action.buttons.push(
//           {
//             type: "reply",
//             reply: {
//               id: i,
//               title: card.buttons[i].name
//             }
//           }
//         )
//       } 
//     } 

//     messageObject.interactive = interactiveObject;

//     const messageData: Message = {
//       conversation_id: this.state.conversation.conversation_id,
//       sender: this.state.agent.name,
//       content: {
//         header: interactiveObject.header && interactiveObject.header.image ? interactiveObject.header.image.link : "",
//         body: interactiveObject.body.text,
//         footer: interactiveObject.footer ? interactiveObject.footer.text : "",
//         buttons: interactiveObject.action.buttons
//       },
//        type: "agent"
//     }
//     await this.conversationsService.createMessage(messageData);

//     await this.redis.set(this.redisKey, JSON.stringify(this.state));

//     await this.send(messageObject);
//     return;
//   }
    
//   async waImageMessage(image: any) {
//     if(this.state === null) {
//       await this.init();
//     }

//     let messageObject: MessageObject = {
//       messaging_product: "whatsapp",
//       recipient_type: "individual",
//       to: this.state.client.contact_identifier,
//       type: "image",
//       image: {
//           link: image.link
//         }
//     };


//     const messageData: Message = {
//       conversation_id: this.state.conversation.conversation_id,
//       sender: this.state.agent.name,
//       content: {
//         header: "",
//         body: messageObject.image.link,
//         footer: "",
//         buttons: []
//       }, 
//       type: "agent"
//     }

//     await this.conversationsService.createMessage(messageData);

//     await this.redis.set(this.redisKey, JSON.stringify(this.state));
    
//     await this.send(messageObject);
//     return;
//   }
// }

// export default Whatsapp;