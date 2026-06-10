import { Request, Response, NextFunction } from "express";
import {OAuth2Client} from "google-auth-library"
import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import { pool } from "../config/db.js";
import jwt from "jsonwebtoken"
import { ApiResponse } from "../utils/ApiResponse.js";


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID) ;


const googleLogin = asyncHandler(async(req : Request, res: Response, next :NextFunction)=>{
    const {token} = req.body ;

    if(!token){
        throw new ApiError(400, "No token provided");
    }

    const ticket = await client.verifyIdToken({
            idToken : token,
            audience : process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    if(!payload){
        throw new ApiError(400, "Invalid Google Token")
    }
    const {sub : googleId , email, name, picture} = payload


    

    let userResult = await pool.query(`SELECT * FROM users WHERE google_id = $1`, [googleId])
    let user = userResult.rows[0];


    if(!user){
        const query = `
            INSERT INTO users(google_id, email, name, avatar_url)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const newUserResult = await pool.query(query, [googleId, email, name, picture]);
        user = newUserResult.rows[0];
    }


    const sessionToken = jwt.sign(
        {id : user.id, email: user.email},
        process.env.JWT_SECRET as string,
        {
            expiresIn: (process.env.JWT_EXPIRY || "1d") as any
        }
    );

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    };

    return res
    .status(200)
    .cookie("accessToken", sessionToken, options)
    .json(
        new ApiResponse(200, {user, token: sessionToken}, "User logged in successfully")
    );


});


export {googleLogin};