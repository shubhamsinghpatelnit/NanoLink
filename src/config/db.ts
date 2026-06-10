import {Pool} from "pg"

const pool = new Pool({
    connectionString : process.env.DATABASE_URL,
});


pool.on('connect', ()=>{
    console.log("Database Pool Connected Successfully")
})

pool.on('error', (err)=>{
    console.log("Unexpected error on idle client", err);
    process.exit(-1);
})


export {pool};