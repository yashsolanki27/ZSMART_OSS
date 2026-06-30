import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { listResourceTasks, createResourceTask, getResourceTask, updateResourceTask, deleteResourceTask } from "../controllers/resourceTaskController.js";

const router = Router();
router.get("/", auth, listResourceTasks);
router.post("/", auth, createResourceTask);
router.get("/:id", auth, getResourceTask);
router.put("/:id", auth, updateResourceTask);
router.delete("/:id", auth, deleteResourceTask);
export default router;
