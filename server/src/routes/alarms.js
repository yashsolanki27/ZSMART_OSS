import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { listAlarms, createAlarm, getAlarm, updateAlarm, deleteAlarm } from "../controllers/alarmController.js";

const router = Router();
router.get("/", auth, listAlarms);
router.post("/", auth, createAlarm);
router.get("/:id", auth, getAlarm);
router.put("/:id", auth, updateAlarm);
router.delete("/:id", auth, deleteAlarm);
export default router;
