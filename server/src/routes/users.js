import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { listUsers, createUser, getUser, updateUser, deleteUser } from "../controllers/userController.js";

const router = Router();

const userSchema = {
  body: {
    username: { required: true, type: "string" },
    fullName: { required: true, type: "string" },
    email: { required: true, type: "string" },
    password: { required: true, type: "string" },
  },
};

router.get("/", auth, listUsers);
router.post("/", auth, validate(userSchema), createUser);
router.get("/:id", auth, getUser);
router.put("/:id", auth, updateUser);
router.delete("/:id", auth, deleteUser);

export default router;
