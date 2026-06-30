import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { listRoles, createRole, getRole, updateRole, deleteRole } from "../controllers/roleController.js";

const router = Router();
router.get("/", auth, listRoles);
router.post("/", auth, createRole);
router.get("/:id", auth, getRole);
router.put("/:id", auth, updateRole);
router.delete("/:id", auth, deleteRole);
export default router;
