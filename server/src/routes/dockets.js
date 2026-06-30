import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { listDockets, createDocket, getDocket, updateDocket, deleteDocket } from "../controllers/docketController.js";

const router = Router();
router.get("/", auth, listDockets);
router.post("/", auth, createDocket);
router.get("/:id", auth, getDocket);
router.put("/:id", auth, updateDocket);
router.delete("/:id", auth, deleteDocket);
export default router;
