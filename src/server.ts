import "dotenv/config"


import {app} from "./app.js"

import { createUrlTable } from "./models/urlModel.js"
import { createUserTable } from "./models/userModel.js"
import {pool} from "./config/db.js"



const startServer = async () =>{
    try{

        await pool.query(`SELECT NOW()`);
        console.log("Database Connection Verified!!!")

        await createUserTable() ;
        console.log("Users table created Successfully")

        await createUrlTable()
        console.log("URLs table created successfully")


        const PORT = process.env.PORT || 3000

        const server = app.listen(PORT , ()=>{
            console.log(`Server is running at http://localhost:${PORT}/`)
        })

        server.on('error', (error)=>{
            console.error("Server failed to start: ", error);
            process.exit(1);
        })

    }
    catch(err){
        console.error("Error while forming tables", err);
        process.exit(1);
    }
}

startServer()

process.on('unhandledRejection', (err)=>{
    console.error(`Error: ${err}`);
    console.log("Shutting down the server due to Unhandled Promise Rejection");
    process.exit(1);
})

process.on('uncaughtException', (err)=>{
    console.error(`Error: ${err}`);
    console.log("Shutting down sever due to Uncaught Exception");
    process.exit(1)
})