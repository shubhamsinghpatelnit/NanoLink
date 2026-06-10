import { pool } from "../config/db.js";


export interface User{
    id : number,
    google_id : string,
    email : string,
    name : string,
    avatar_url : string,
    created_at : Date

}

export const createUserTable = async ()=>{

    const query = `
        CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            google_id VARCHAR(255) UNIQUE NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            name VARCHAR(255),
            avatar_url TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
        );
    `
    try{
        await pool.query(query)
        console.log("User Table Created Successfully")
    }
    catch(error){
        console.error("User Table Creation Failed: ", error)
    }
}