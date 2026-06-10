import {Router} from "express"
import { createShortUrl, redirectToOriginal, getUrls } from "../controllers/urlController.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"


const router = Router()


router.route("/shorten").post(
    verifyJWT, createShortUrl
)

router.route("/dashboard/my-urls").get(
    verifyJWT, getUrls 
)


router.route("/:shortCode").get(
    redirectToOriginal
)




export default router