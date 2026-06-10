import {pool} from "../config/db.js"

export interface Url {
    id : number;
    user_id : number | null;
    original_url : string;
    short_code : string;
    clicks : number;
    created_at : Date;
}

export const createUrlTable = async () =>{
    const query = `
        CREATE TABLE IF NOT EXISTS urls(
            id SERIAL PRIMARY KEY,
            original_url TEXT NOT NULL,
            short_code VARCHAR(10) UNIQUE NOT NULL,
            clicks INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `
    const alterQuery = `
        ALTER TABLE urls
        ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE CASCADE;
    `;

    try{
        await pool.query(query);
        await pool.query(alterQuery);
        console.log("Table 'urls' created successfully." )
    }
    catch(err){
        console.error("Error while creating 'urls' table : ", err);
    }
}
