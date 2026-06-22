import { Router } from "express";
import { register } from "../controllers/authController";

const router = Router();

// This maps the POST /register URL to your controller function
router.post("/register", register);

export default router;
