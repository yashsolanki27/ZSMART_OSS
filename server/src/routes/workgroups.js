import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { listWorkgroups, createWorkgroup, getWorkgroup, updateWorkgroup, deleteWorkgroup } from "../controllers/workgroupController.js";

const router = Router();
router.get("/", auth, listWorkgroups);
router.post("/", auth, createWorkgroup);
router.get("/:id", auth, getWorkgroup);
router.put("/:id", auth, updateWorkgroup);
router.delete("/:id", auth, deleteWorkgroup);
export default router;
