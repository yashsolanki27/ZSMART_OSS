import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { listOrders, createOrder, getOrder, updateOrder, deleteOrder } from "../controllers/orderController.js";

const router = Router();
router.get("/", auth, listOrders);
router.post("/", auth, createOrder);
router.get("/:id", auth, getOrder);
router.put("/:id", auth, updateOrder);
router.delete("/:id", auth, deleteOrder);
export default router;
