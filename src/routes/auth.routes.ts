import { Router } from "express";
import { googleLogin } from "../controllers/authController.js";

const router = Router();


router.route("/google").post(googleLogin);

export default router;