// import { SessionState } from "../interface/app";
// import axios from 'axios';

// class VoiceflowService {
//   async interact(state: SessionState) {
//       const voiceflowResponse = await axios.post(`https://general-runtime.voiceflow.com/state/user/${state.client}/interact?logs=off`,
//           {request: state.request},
//           {
//             headers: {
//               accept: 'application/json',
//               'content-type': 'application/json',
//               Authorization: state.agent.apiKey,
//               'versionID': 'production'
//             }
//           }
//         );
  
//         if(state.request.type == "launch"){
//           const options = {
//             method: 'PATCH',
//             url: `https://general-runtime.voiceflow.com/state/user/${state.client}/variables`,
//             headers: {
//               accept: 'application/json',
//               'content-type': 'application/json',
//               Authorization: state.agent.apiKey,
//               'version': 'production'
//             },
//             data: {
//               agent: state.agent.phone.length > 0 ? state.agent.phone : state.agent.agentid,
//               client: state.client.contactIdentifier,
//               conversation: state.conversation.conversation_id
//             }
//           };
          
//           await axios(options)
//         }

//         console.log("RESPONSE:::::::::::::", voiceflowResponse.data)
        
//         if (!voiceflowResponse || !voiceflowResponse.data || !Array.isArray(voiceflowResponse.data)) {
//           throw new Error('Voiceflow error');
//         };

//         const messages = this.sortVoiceflowData(voiceflowResponse.data);
//         return messages;
//   }

//   private sortVoiceflowData(data: any): Array<any> {
//       let messages = [];

//       for(const trace of data){
//         switch(trace.type) {
//             case "text":
//             case "speech":
//                 messages.push({
//                     text: trace.payload.message
//                 });
//                 break;
//             case "choice":
//                 messages.push({
//                     buttons: trace.payload.buttons
//                 });
//                 break;
//               case "cardV2":
//                   messages.push({
//                     cardV2: {
//                       header: trace.payload.imageUrl,
//                       body: trace.payload.title,
//                       footer: trace.payload.description.text,
//                       buttons: trace.payload.buttons
//                     }
//                   });
                
//                 break;
//               case "visual":
//                 messages.push({
//                   visual: {
//                     link: trace.payload.image
//                   }
//                 })  
//                 break;
//             case "end":
//                 console.log("Interaction ended.");
//                 messages.push({
//                   end: "end"
//                 });
//                 break
//             default:
//                 break;           
//         }
//       }

//       return messages;
//   }
// }

// export default  VoiceflowService