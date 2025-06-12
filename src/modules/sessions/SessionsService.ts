import { Session } from './sessions.interface'

import { RedisClientType } from 'redis';

export default class SessionService {
    private client: RedisClientType;
    private block = "sessions.service"
    constructor(client: RedisClientType) {
        this.client = client;
    }

    async set(sessionId: string, session: Session): Promise<void> {
        try {
            await this.client.setEx(sessionId, 86400, JSON.stringify(session))
            console.log(`Session: ${sessionId} set`);
            return;
        } catch (error) {
            throw error;
        }
    }

    async get(sessionId: string): Promise<Session | null> {
        try {
            const session = await this.client.get(sessionId);
            if(session) {
                return JSON.parse(session) as Session;
            }

            return null;
        } catch (error) {
            throw error;
        }
    }

    async delete(sessionId: string): Promise<void> {
        try {
            await this.client.del(sessionId);
            console.log("Session deleted")
        } catch (error) {
            throw error;
        }
    }

}
