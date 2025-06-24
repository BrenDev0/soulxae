import axios from 'axios';
import Container from '../../core/dependencies/Container';
import { DirectMessagagingService } from '../directMessaging/DirectMessagingService';
import { MessageData } from '../messages/messages.interface';
import FlowConfigsService from '../flowConfig/FlowConfigService';
import { BadRequestError } from '../../core/errors/errors';
import { handleServiceError } from '../../core/errors/error.service';

class VoiceflowService {
    async interact(conversationId: string, request: any, agentId: string) {
        const block = "voiceflow.service.interact"
        try {
            const flowConfigService = Container.resolve<FlowConfigsService>("FlowConfigService");
            const flowConfig = await flowConfigService.resource(agentId);
            if(!flowConfig) {
                throw new BadRequestError("Agent configuration errror")
            }
            const voiceflowResponse = await axios.post(
                `https://general-runtime.voiceflow.com/state/user/${conversationId}/interact?logs=off`,
                {request: request},
                {
                    headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                    Authorization: flowConfig.apiKey,
                    'versionID': 'production'
                    }
                }
            );
        
            if(request.type == "launch"){
                const options = {
                    method: 'PATCH',
                    url: `https://general-runtime.voiceflow.com/state/user/${conversationId}/variables`,
                    headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                    Authorization: flowConfig.apiKey,
                    'version': 'production'
                    }
                };
            
                await axios(options)
            }

            console.log("RESPONSE:::::::::::::", voiceflowResponse.data)
                
            if (!voiceflowResponse || !voiceflowResponse.data || !Array.isArray(voiceflowResponse.data)) {
                throw new Error('Voiceflow error');
            };

            await this.handleVoiceflowData(voiceflowResponse.data);
            return;
        } catch (error) {
            handleServiceError(error as Error, block, "outgoing", {conversationId, request, agentId})
            throw error;
        }
    }

    private async handleVoiceflowData(data: any): Promise<void> {
        const directMessagingService = Container.resolve<DirectMessagagingService>("DirectMessagingService")
        for(let i = 0; i < data.length; i++){
            const message = data[i];
            const nextMessage =  data[i + 1];

            const messageData: MessageData = {
                conversationId: "",
                messageReferenceId: "",
                sender: "",
                type: "",
                text: null,
                subText: null,
                media: null,
                mediaType: null,
                buttons: null
            }

            if(message.trace.type === "text" && (!nextMessage || nextMessage?.trace?.type === "text" || nextMessage?.trace?.type !== "choice")) {
                messageData.type = "text";

                messageData.text = message.trace.payload.message;

                await directMessagingService.handleOutGoingMessage(messageData as MessageData)

                continue;
            } else if(message.trace.type === "text" && nextMessage?.trace?.type === "choice") {
                messageData.type = "buttons";

                messageData.text = message.trace.payload.message;

                messageData.buttons = message.trace.payload.buttons

                await directMessagingService.handleOutGoingMessage(messageData);

                return;
            } else if(message.trace.type === "cardV2") {
                messageData.type = "buttons";

                if(message.trace.payload.imageUrl) {
                    message.media =  [message.trace.payload.imageUrl];
                }

                messageData.text = message.trace.payload.title;
                messageData.subText = message.trace.payload.description.text

                if(message.trace.payload.buttons) {
                    message.buttons = message.trace.payload.buttons;
                }

                await directMessagingService.handleOutGoingMessage(messageData);
                return 
            } else if(message.trace.type === "visual") {
                messageData.type = "image";

                messageData.media = [message.trace.payload.image]

                await directMessagingService.handleOutGoingMessage(messageData)

                continue;
            } else if(message.end) {
                return;
            }
        }
    }
}

export default  VoiceflowService