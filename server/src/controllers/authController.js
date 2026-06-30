import * as authService from "../services/authService.js";

export async function login(req, res, next) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "validation_error", message: "Username and password are required" });
    }
    const result = await authService.login(username, password);
    res.json(result);
  } catch (e) { next(e); }
}

export async function profile(req, res, next) {
  try {
    const user = await authService.getProfile(req.user.id);
    res.json(user);
  } catch (e) { next(e); }
}
