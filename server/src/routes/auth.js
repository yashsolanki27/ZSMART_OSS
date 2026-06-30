import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { login, profile } from "../controllers/authController.js";

const router = Router();
router.post("/login", login);
router.get("/profile", auth, profile);

export default router;
