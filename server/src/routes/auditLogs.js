import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { listAuditLogs, createAuditLog, getAuditLog, deleteAuditLog } from "../controllers/auditLogController.js";

const router = Router();
router.get("/", auth, listAuditLogs);
router.post("/", auth, createAuditLog);
router.get("/:id", auth, getAuditLog);
router.delete("/:id", auth, deleteAuditLog);
export default router;
