import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { listTasks, createTask, getTask, updateTask, deleteTask } from "../controllers/taskController.js";

const router = Router();
router.get("/", auth, listTasks);
router.post("/", auth, createTask);
router.get("/:id", auth, getTask);
router.put("/:id", auth, updateTask);
router.delete("/:id", auth, deleteTask);
export default router;
