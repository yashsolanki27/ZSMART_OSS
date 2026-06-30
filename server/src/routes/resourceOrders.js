import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { listResourceOrders, createResourceOrder, getResourceOrder, updateResourceOrder, deleteResourceOrder } from "../controllers/resourceOrderController.js";

const router = Router();
router.get("/", auth, listResourceOrders);
router.post("/", auth, createResourceOrder);
router.get("/:id", auth, getResourceOrder);
router.put("/:id", auth, updateResourceOrder);
router.delete("/:id", auth, deleteResourceOrder);
export default router;
