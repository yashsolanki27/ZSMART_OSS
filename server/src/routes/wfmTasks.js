import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { listWfmTasks, createWfmTask, getWfmTask, updateWfmTask, deleteWfmTask } from "../controllers/wfmTaskController.js";

const router = Router();
router.get("/", auth, listWfmTasks);
router.post("/", auth, createWfmTask);
router.get("/:id", auth, getWfmTask);
router.put("/:id", auth, updateWfmTask);
router.delete("/:id", auth, deleteWfmTask);
export default router;
