import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { listTickets, createTicket, getTicket, updateTicket, deleteTicket } from "../controllers/ticketController.js";

const router = Router();
router.get("/", auth, listTickets);
router.post("/", auth, createTicket);
router.get("/:id", auth, getTicket);
router.put("/:id", auth, updateTicket);
router.delete("/:id", auth, deleteTicket);
export default router;
