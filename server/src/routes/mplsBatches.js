import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { listMplsBatches, createMplsBatch, getMplsBatch, updateMplsBatch, deleteMplsBatch } from "../controllers/mplsBatchController.js";

const router = Router();
router.get("/", auth, listMplsBatches);
router.post("/", auth, createMplsBatch);
router.get("/:id", auth, getMplsBatch);
router.put("/:id", auth, updateMplsBatch);
router.delete("/:id", auth, deleteMplsBatch);
export default router;
