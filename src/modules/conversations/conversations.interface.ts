import { IRepository } from "../../core/repository/repository.interface";

export interface Conversation {
  conversation_id?: string;
  platform_id: string;
  client_id: string;
  title: string | null;
  handoff: boolean;
  created_at?: Date
}

export interface ConversationData {
  conversationId?: string;
  platformId: string;
  clientId: string;
  title: string | null;
  handoff: boolean;
  createdAt?: Date,
}

export interface ConversationForAPI {
  conversation_id: string;
  platform: string;
  client_id: string;
  platform_identifier: string;
  client_identifier: string ;
  token: string;
}

export interface ConversationForAPIData {
  conversationId: string;
  platform: string;
  clientId: string;
  platformIdentifier: string;
  clientIdentifier: string ;
  token: string;
}

export interface ConversationS3Key {
  conversation_id: string;
  platform_id: string;
  agent_id: string;
  user_id: string;
}

export interface IConversationsRepository extends IRepository<Conversation> {
  getAPIData(conversationId: string): Promise<ConversationForAPI | null>;
  findByIds(agentId: string, clientId: string): Promise<Conversation | null>;
  getS3BucketKeyData(conversationId: string): Promise<ConversationS3Key | null>;
}
