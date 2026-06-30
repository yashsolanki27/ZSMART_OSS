import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { listServiceInstances, createServiceInstance, getServiceInstance, updateServiceInstance, deleteServiceInstance } from "../controllers/serviceInstanceController.js";

const router = Router();
router.get("/", auth, listServiceInstances);
router.post("/", auth, createServiceInstance);
router.get("/:id", auth, getServiceInstance);
router.put("/:id", auth, updateServiceInstance);
router.delete("/:id", auth, deleteServiceInstance);
export default router;
