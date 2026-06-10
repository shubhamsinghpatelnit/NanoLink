import { Request, Response, NextFunction } from "express"
import {pool} from "../config/db.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import {encode, decode} from "../services/urlService.js"


const createShortUrl = asyncHandler(async(req : Request, res : Response, next : NextFunction)=>{
    const {originalUrl} = req.body ;
    const userId = (req as any).user?.id || null ;


    if(!originalUrl){
        throw new ApiError(400, "No URL provided");
    }
    const result = await pool.query(`SELECT nextval('urls_id_seq')`);
    const nextID = parseInt(result.rows[0].nextval);

    const encodedString = encode(nextID) ;

    const query = `
        INSERT INTO urls (id, original_url, short_code, user_id)
        VALUES($1, $2, $3, $4)
        RETURNING *;
    `

    const data = await pool.query(query, [nextID, originalUrl, encodedString, userId]);
    const urlEntry = data.rows[0];

    return res.status(201).json(
        new ApiResponse(201, urlEntry, "URL shortened successfully")
    )
    
})


const redirectToOriginal = asyncHandler( async(req : Request, res : Response, next : NextFunction) =>{

    const {shortCode} = req.params ;
    const id = decode(shortCode);

    const query = `SELECT original_url FROM urls WHERE id = $1`

    const entry = await pool.query(query, [id])

    if(entry.rowCount === 0){
        throw new ApiError(404, "URL not found")
    }

    const originalUrl = entry.rows[0].original_url

    await pool.query("UPDATE urls SET clicks = clicks + 1 WHERE id = $1", [id]);

    return res.redirect(originalUrl)

})


const getUrls = asyncHandler( async(req : Request, res : Response, _) =>{
    const userId = (req as any)?.user.id 

    const query = `SELECT * FROM urls WHERE user_id = $1 ORDER BY created_at DESC`

    const payload = await pool.query(query, [userId]);

    const urls = payload.rows ;

    return res.status(200)
    .json(
        new ApiResponse(200, urls, "URLS fetched successfully")
    )
})


export {createShortUrl, redirectToOriginal, getUrls}