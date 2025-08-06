export interface AiConfig {
  ai_config_id: string;
  agent_id: string;
  system_prompt: string;
  max_tokens: string;
  temperature: string;
  calendar_id: string | null
}

export interface AiConfigData {
  aiConfigId: string;
  agentId: string;
  systemPrompt: string;
  maxTokens: string;
  temperature: string;
  calendarId: string | null
}
