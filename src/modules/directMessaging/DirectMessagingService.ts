import Container from "../../core/dependencies/Container";
import { handleServiceError } from "../../core/errors/error.service";
import { BadRequestError, NotFoundError } from "../../core/errors/errors";
import ConversationsService from "../conversations/ConversationsService";
import { MessageData } from "../messages/messages.interface";
import MessagesService from "../messages/MessagesService";
import MessengerService from "../messenger/MessengerService";
import WhatsappService from "../whatsapp/WhatsappService";

export class DirectMessagagingService {
    private readonly block = "directMessaging.service"
   async handleOutGoingMessage(message: MessageData) {
    try {
        const conversationsService = Container.resolve<ConversationsService>("ConversationsService");
           
            const conversation = await conversationsService.getAPIData(message.conversationId);
            if(!conversation) {
                throw new NotFoundError("conversation not found")
            }

            let productService;
            switch(conversation.platform) {
                case "messenger":
                    productService = Container.resolve<MessengerService>("MessengerService");
                    break;
                case 'whatsapp':
                    productService = Container.resolve<WhatsappService>("WhatsappService");
                    break;
                default:
                    break    
            }

            if(!productService) {
                throw new BadRequestError("Unsupported messaging product")
            }

            const messageRefereceId = await productService.handleOutgoingMessage(message, conversation.platformIdentifier, conversation.clientIdentifier, conversation.token);

            const messagesService = Container.resolve<MessagesService>("MessagesService");
            await messagesService.create({
                messageReferenceId: messageRefereceId,
                conversationId: conversation.conversationId!,
                sender: "agent",
                type: message.type,
                text: message.text ? message.text : null,
                subText: message.subText ? message.subText : null,
                media: message.media ? message.media : null,
                mediaType: message.mediaType ? message.mediaType : null,
                buttons: message.buttons ? message.buttons : null
            })
    } catch (error) {
        handleServiceError(error as Error, this.block, "outgoing", {message})
        throw error;
    }
   }
}