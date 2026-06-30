import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { listAssurances, createAssurance, getAssurance, updateAssurance, deleteAssurance } from "../controllers/assuranceController.js";

const router = Router();
router.get("/", auth, listAssurances);
router.post("/", auth, createAssurance);
router.get("/:id", auth, getAssurance);
router.put("/:id", auth, updateAssurance);
router.delete("/:id", auth, deleteAssurance);
export default router;
