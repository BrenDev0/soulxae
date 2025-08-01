import { Pool } from "pg";
import { GoogleUser, IGoogleRepository, Token } from "./google.interface";

export class GoogleRepository implements IGoogleRepository {
    private pool: Pool;
    constructor(pool: Pool) {
        this.pool = pool;
 
    }

    async getGoogleUser(userId: string): Promise<GoogleUser> {
         const sqlRead =  `
            SELECT refresh_token 
            FROM tokens
            WHERE user_id = $1
        `

        const result = await this.pool.query(sqlRead, [userId])

        return result.rows[0];
    }

    async upsertToken(token: Token): Promise<void> {
        const sqlInsert = `
            INSERT INTO tokens (
                refresh_token,
                user_id
            ) VALUES($1, $2)
             ON CONFLICT (user_id) DO UPDATE SET
             refresh_token = EXCLUDED.refresh_token
        `

        const result = await this.pool.query(
            sqlInsert,
            [token.refresh_token, token.user_id]
        )
    }
}