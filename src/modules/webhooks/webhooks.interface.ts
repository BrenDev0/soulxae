export interface AppointmentState{
    next_node: string | null;
    name: string | null;
    email: string | null;
    phone: string | null;
    appointment_datetime: string | null;
}

export interface State {
    system_message: string;
    max_tokens: number;
    temperature: number;
    calendar_id: string | null;
    user_id: string;
    agent_id: string;
    input: string;
    conversation_id: string;
    token: string;
    appointments_state: AppointmentState;
    chat_history: Record<string, any>[] | null;
}
