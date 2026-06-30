import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { listExceptions, createException, getException, updateException, deleteException } from "../controllers/exceptionController.js";

const router = Router();
router.get("/", auth, listExceptions);
router.post("/", auth, createException);
router.get("/:id", auth, getException);
router.put("/:id", auth, updateException);
router.delete("/:id", auth, deleteException);
export default router;
