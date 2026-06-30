import * as userService from "../services/userService.js";

export async function listUsers(req, res, next) {
  try {
    const { page = 1, limit = 20, ...filter } = req.query;
    const result = await userService.list({ filter, page: +page, limit: +limit });
    res.json(result);
  } catch (e) { next(e); }
}

export async function createUser(req, res, next) {
  try {
    const user = await userService.create(req.body);
    res.status(201).json(user);
  } catch (e) { next(e); }
}

export async function getUser(req, res, next) {
  try {
    const user = await userService.getById(+req.params.id);
    if (!user) return res.status(404).json({ error: "not_found", message: "User not found" });
    res.json(user);
  } catch (e) { next(e); }
}

export async function updateUser(req, res, next) {
  try {
    const user = await userService.update(+req.params.id, req.body);
    if (!user) return res.status(404).json({ error: "not_found", message: "User not found" });
    res.json(user);
  } catch (e) { next(e); }
}

export async function deleteUser(req, res, next) {
  try {
    await userService.remove(+req.params.id);
    res.status(204).end();
  } catch (e) { next(e); }
}
