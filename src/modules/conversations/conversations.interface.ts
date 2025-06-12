import { IRepository } from "../../core/repository/repository.interface";

export interface Conversation {
  conversation_id?: string;
  agent_id: string;
  platform: string;
  client_id: string;
  title: string | null;
  handoff: boolean;
  created_at?: Date
  platform_identifier?: string;
  client_identifier?: string 
}

export interface ConversationData {
  conversationId?: string;
  agentId: string;
  platform: string;
  clientId: string;
  title: string | null;
  handoff: boolean;
  createdAt?: Date,
  platformIdentifier?: string;
  clientIdentifier?: string 
}

export interface ConversationForAPI {
  conversation_id: string;
  agent_id: string;
  platform: string;
  client_id: string;
  title: string | null;
  handoff: boolean;
  platform_identifier: string;
  client_identifier: string ;
  token: string;
}

export interface ConversationForAPIData {
  conversationId: string;
  agentId: string;
  platform: string;
  clientId: string;
  title: string | null;
  handoff: boolean;
  platformIdentifier: string;
  clientIdentifier: string ;
  token: string;
}

export interface IConversationsRepository extends IRepository<Conversation> {
  getAPIData(conversationId: string): Promise<ConversationForAPI | null>
}
