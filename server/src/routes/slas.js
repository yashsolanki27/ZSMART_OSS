import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { listSlas, createSla, getSla, updateSla, deleteSla } from "../controllers/slaController.js";

const router = Router();
router.get("/", auth, listSlas);
router.post("/", auth, createSla);
router.get("/:id", auth, getSla);
router.put("/:id", auth, updateSla);
router.delete("/:id", auth, deleteSla);
export default router;
