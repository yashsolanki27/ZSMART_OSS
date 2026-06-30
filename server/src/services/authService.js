import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../prismaClient.js";

const SECRET = process.env.JWT_SECRET || "dev_secret_change_in_production_9f3a7c1e";
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || "8h";

export async function login(username, password) {
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) throw Object.assign(new Error("Invalid credentials"), { status: 401, code: "auth_failed" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw Object.assign(new Error("Invalid credentials"), { status: 401, code: "auth_failed" });

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    SECRET,
    { expiresIn: EXPIRES_IN }
  );

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date().toISOString() },
  });

  return {
    token,
    user: { id: user.id, username: user.username, fullName: user.fullName, email: user.email, role: user.role },
  };
}

export async function getProfile(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw Object.assign(new Error("User not found"), { status: 404, code: "not_found" });
  return user;
}
