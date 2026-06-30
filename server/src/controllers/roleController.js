import * as roleService from "../services/roleService.js";

export async function listRoles(req, res, next) {
  try {
    const { page = 1, limit = 20, ...filter } = req.query;
    const result = await roleService.list({ filter, page: +page, limit: +limit });
    res.json(result);
  } catch (e) { next(e); }
}

export async function createRole(req, res, next) {
  try {
    const item = await roleService.create(req.body);
    res.status(201).json(item);
  } catch (e) { next(e); }
}

export async function getRole(req, res, next) {
  try {
    const item = await roleService.getById(+req.params.id);
    if (!item) return res.status(404).json({ error: "not_found", message: "Role not found" });
    res.json(item);
  } catch (e) { next(e); }
}

export async function updateRole(req, res, next) {
  try {
    const item = await roleService.update(+req.params.id, req.body);
    if (!item) return res.status(404).json({ error: "not_found", message: "Role not found" });
    res.json(item);
  } catch (e) { next(e); }
}

export async function deleteRole(req, res, next) {
  try {
    await roleService.remove(+req.params.id);
    res.status(204).end();
  } catch (e) { next(e); }
}
