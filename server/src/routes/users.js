import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { listUsers, createUser, getUser, updateUser, deleteUser } from "../controllers/userController.js";

const router = Router();

router.get("/", auth, listUsers);
router.post("/", auth, createUser);
router.get("/:id", auth, getUser);
router.put("/:id", auth, updateUser);
router.delete("/:id", auth, deleteUser);

export default router;
