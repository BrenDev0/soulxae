export interface Client {
  client_id?: string;
  agent_id: string;
  name: string | null;
  contact_identifier: string;
}

export interface ClientData {
  clientId?: string;
  agentId: string;
  name: string | null;
  contactIdentifier: string;
}
