import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { listMigrations, createMigration, getMigration, updateMigration, deleteMigration } from "../controllers/migrationController.js";

const router = Router();
router.get("/", auth, listMigrations);
router.post("/", auth, createMigration);
router.get("/:id", auth, getMigration);
router.put("/:id", auth, updateMigration);
router.delete("/:id", auth, deleteMigration);
export default router;
