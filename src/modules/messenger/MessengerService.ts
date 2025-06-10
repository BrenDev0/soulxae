// import { MessengerData, MessengerTemplateElements } from '../interface/app';
// import axios from 'axios';
// import Redis from './Redis';
// import ConversationsService from '../services/ConversationsService';
// import { Message } from '../interface/models/conversations';

// class Messenger {
//   private state: any;
//   private redis: Redis;
//   private redisKey: string;
//   private conversationsService: ConversationsService;
    
//   constructor(conversationsService: ConversationsService, redisKey: string) {
//     this.redis = new Redis();
//     this.redisKey = redisKey;
//     this.conversationsService = conversationsService;
//     this.state = null
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
//         `https://graph.facebook.com/${process.env.MESSENGER_VERSION}/${this.state.agent.agentid}/messages?access_token=${this.state.token}`,
//         messageObject,
//         {
//           headers: {
//             Authorization: `Bearer ${this.state.agent.token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );   
//       console.log("message sent");
//       return;  
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
//         },type: "agent"
//       }
  
//       const messageData = {
//         recipient:{
//           id: this.state.client.contact_identifier
//         },
//         messaging_type: "RESPONSE",
//         message: {
//         text: message.text
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

//   async buttonsMessage(data: any[]) {
//     if(this.state === null) {
//       await this.init();
//     }
//     const messageBody = data[0];
//     const buttons = data[1];

//     let messageObject: MessengerData = {
//       recipient: {
//         id: this.state.client.contact_identifier
//       },
//       messaging_type: "RESPONSE",
//       message: {
//         text: messageBody,
//         quick_replies: []
//       }
//     }

//     for(let i = 0; i < buttons.length; i++) {
//       if(!this.state[buttons[i].name.toUpperCase()]) {
//         this.state[buttons[i].name.toUpperCase()] = buttons[i].request
//       }
//       //console.log(message.buttons[i].request.payload.actions) web url fro buttons
//       messageObject.message.quick_replies.push({
//         content_type:"text",
//         title: buttons[i].name,
//         payload: i
//       })
//     } 

//     const messageData: Message = {
//       conversation_id: this.state.conversation.conversation_id,
//       sender: this.state.agent.name,
//       content: {
//         header: "",
//         body: messageObject.message.text,
//         footer: "",
//         buttons: messageObject.message.quick_replies,
//       },
//       type: "agent"
//     }
//     await this.conversationsService.createMessage(messageData);

//     await this.redis.set(this.redisKey, JSON.stringify(this.state))
//     await this.send(messageObject);
//     return;
//   }
    
//   async cardMessage(card: any) {
//     if(this.state === null) {
//       await this.init();
//     }

//     let elementsArray: any = []
//     let elements: MessengerTemplateElements  = {
//       title: "",
//       buttons: []
//     }

//     let messageObject = {
//       recipient: {
//         id: this.state.client.contact_identifier
//       },
//       message: {
//         attachment: {
//           type: "template",
//           payload: {
//             template_type: "generic",
//             elements: {}
//           }
//         }
//       }
//     }
//     if(card.header.length > 0 && card.footer.length >0){
//       elements = {
//         title: card.body,
//         image_url: card.header,
//         subtitle: card.footer,
//         buttons: []
//       }
//     } else if(card.header.length > 0 && card.footer.length < 1) {
//       elements = {
//         title: card.body,
//         image_url: card.header,
//         buttons: []
//       }
//     } else if(card.header.length < 1 && card.footer.length > 0) {
//       elements = {
//         title: card.body,
//         subtitle: card.footer,
//         buttons: []
//       }
//     }
    
//     for(let i = 0; i < card.buttons.length; i++) {
//       if(!this.state[card.buttons[i].name.toUpperCase()]) {
//         this.state[card.buttons[i].name.toUpperCase()] = card.buttons[i].request
//       }

//       const url = card.buttons[i]?.request?.payload?.actions?.[0]?.payload?.url;

//       if (url) {
//         elements.buttons!.push({
//           type: "web_url",
//           url,
//           title: card.buttons[i].name
//         });
//       } else {
//         elements.buttons!.push({
//           type: "postback",
//           title: card.buttons[i].name,
//           payload: card.buttons[i].name.toUpperCase()
//         });
// }

//     }
//       //console.log(message.buttons[i].request.payload.actions) web url fro buttons
    
//     const messageData: Message = {
//       conversation_id: this.state.conversation.conversation_id,
//       sender: this.state.agent.name,
//       content: {
//         header: elements.image_url ? elements.image_url :  "",
//         body: elements.title,
//         footer: elements.subtitle ? elements.subtitle : "",
//         buttons: elements.buttons ? elements.buttons : []
//       },
//       type: "agent"
//     }
    
//     await this.conversationsService.createMessage(messageData);
    
//     await this.redis.set(this.redisKey, JSON.stringify(this.state));
//     elementsArray.push(elements)
//     messageObject.message.attachment.payload.elements = elementsArray;
//     await this.send(messageObject);
//     return;
//   }
    
//   async imageMessage(image: any) {
//     if(this.state === null) {
//       await this.init()
//     }

//     let messageObject = {
//       recipient: {
//           id: this.state.client.contact_identifier
//       },
//       messaging_type: "RESPONSE",
//       message: {
//           attachment: {
//             type: "image",
//             payload: {
//               url: image.link,
//               is_reusable: true
//             }
//           }
//       }
//     }

//     const messageData: Message = {
//       conversation_id: this.state.conversation.conversation_id,
//       sender: this.state.agent.name,
//       content: {
//         header: "",
//         body: image.link,
//         footer: "",
//         buttons: []
//       },
//        type: "agent"
//     }
    
//     await this.conversationsService.createMessage(messageData);
//     await this.redis.set(this.redisKey, JSON.stringify(this.state))
//     await this.send(messageObject);
//     return;
//   }
// }

// export default Messenger;