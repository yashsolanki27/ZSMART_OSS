import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { listTeams, createTeam, getTeam, updateTeam, deleteTeam } from "../controllers/teamController.js";

const router = Router();
router.get("/", auth, listTeams);
router.post("/", auth, createTeam);
router.get("/:id", auth, getTeam);
router.put("/:id", auth, updateTeam);
router.delete("/:id", auth, deleteTeam);
export default router;
