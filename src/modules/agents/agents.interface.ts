export interface Agent {
  agent_id?: string;
  agent_type: string;
  workspace_id: string;
  provider: string;
  api_key: string;
  name: string;
  description: string
}

export interface AgentData {
  agentId?: string;
  agentType: string;
  workspaceId: string;
  provider: string;
  apiKey: string;
  name: string;
  description: string

}
