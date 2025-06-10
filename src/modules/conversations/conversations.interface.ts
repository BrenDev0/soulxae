export interface Conversation {
  conversation_id?: string;
  agent_id: string;
  platform: string;
  client_id: string;
  title: string | null;
  handoff: boolean;
  created_at?: Date
}

export interface ConversationData {
  conversationId?: string;
  agentId: string;
  platform: string;
  clientId: string;
  title: string | null;
  handoff: boolean;
  createdAt?: Date
}
