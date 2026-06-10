import jwt, { JwtPayload } from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { Request, NextFunction } from "express"
import { pool } from "../config/db.js"


const verifyJWT = asyncHandler( async(req : Request, _ , next : NextFunction)=>{
    const token = req.cookies?.accessToken || req.header('Authorization')?.replace("Bearer ", "") ;

    if(!token){
        throw new ApiError(401, "Unathorized Access")
    }

    try{
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload ;

        const query = `
            SELECT id, google_id, email, name, avatar_url  FROM users WHERE id = $1
        ` ;
        const result = await pool.query(query, [decodedToken.id]) ;

        const user = result.rows[0]

        if(!user){
            throw new ApiError(401, "Invalid Access Token");
        }

        (req as any).user = user ;
        next();
    }
    catch(error){
        throw new ApiError(401, "Invalid Access Token")
    }


})

export {verifyJWT}