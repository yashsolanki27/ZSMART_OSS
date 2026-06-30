import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { listMacRecords, createMacRecord, getMacRecord, updateMacRecord, deleteMacRecord } from "../controllers/macRecordController.js";

const router = Router();
router.get("/", auth, listMacRecords);
router.post("/", auth, createMacRecord);
router.get("/:id", auth, getMacRecord);
router.put("/:id", auth, updateMacRecord);
router.delete("/:id", auth, deleteMacRecord);
export default router;
