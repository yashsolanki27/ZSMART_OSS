import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { listBsnlRequests, createBsnlRequest, getBsnlRequest, updateBsnlRequest, deleteBsnlRequest } from "../controllers/bsnlRequestController.js";

const router = Router();
router.get("/", auth, listBsnlRequests);
router.post("/", auth, createBsnlRequest);
router.get("/:id", auth, getBsnlRequest);
router.put("/:id", auth, updateBsnlRequest);
router.delete("/:id", auth, deleteBsnlRequest);
export default router;
