import { Pool } from "pg";
import { GoogleUser, IGoogleRepository } from "./google.interface";

export class GoogleRepository implements IGoogleRepository {
    private pool: Pool;
    constructor(pool: Pool) {
        this.pool = pool;
 
    }

    async getGoogleUser(calendarId: string): Promise<GoogleUser> {
         const sqlRead =  `
            SELECT refresh_token 
            FROM calendars
            WHERE calendar_id = $1
        `

        const result = await this.pool.query(sqlRead, [calendarId])

        return result.rows[0];
    }
}