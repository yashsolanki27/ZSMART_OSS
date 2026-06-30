import * as workgroupService from "../services/workgroupService.js";

export async function listWorkgroups(req, res, next) {
  try {
    const { page = 1, limit = 20, ...filter } = req.query;
    const result = await workgroupService.list({ filter, page: +page, limit: +limit });
    res.json(result);
  } catch (e) { next(e); }
}

export async function createWorkgroup(req, res, next) {
  try {
    const item = await workgroupService.create(req.body);
    res.status(201).json(item);
  } catch (e) { next(e); }
}

export async function getWorkgroup(req, res, next) {
  try {
    const item = await workgroupService.getById(+req.params.id);
    if (!item) return res.status(404).json({ error: "not_found", message: "Workgroup not found" });
    res.json(item);
  } catch (e) { next(e); }
}

export async function updateWorkgroup(req, res, next) {
  try {
    const item = await workgroupService.update(+req.params.id, req.body);
    if (!item) return res.status(404).json({ error: "not_found", message: "Workgroup not found" });
    res.json(item);
  } catch (e) { next(e); }
}

export async function deleteWorkgroup(req, res, next) {
  try {
    await workgroupService.remove(+req.params.id);
    res.status(204).end();
  } catch (e) { next(e); }
}
