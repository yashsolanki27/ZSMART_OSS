import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { listIncidents, createIncident, getIncident, updateIncident, deleteIncident } from "../controllers/incidentController.js";

const router = Router();
router.get("/", auth, listIncidents);
router.post("/", auth, createIncident);
router.get("/:id", auth, getIncident);
router.put("/:id", auth, updateIncident);
router.delete("/:id", auth, deleteIncident);
export default router;
