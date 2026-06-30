import * as resourceTaskService from "../services/resourceTaskService.js";

export async function listResourceTasks(req, res, next) {
  try {
    const { page = 1, limit = 20, ...filter } = req.query;
    const result = await resourceTaskService.list({ filter, page: +page, limit: +limit });
    res.json(result);
  } catch (e) { next(e); }
}

export async function createResourceTask(req, res, next) {
  try {
    const item = await resourceTaskService.create(req.body);
    res.status(201).json(item);
  } catch (e) { next(e); }
}

export async function getResourceTask(req, res, next) {
  try {
    const item = await resourceTaskService.getById(+req.params.id);
    if (!item) return res.status(404).json({ error: "not_found", message: "Resource task not found" });
    res.json(item);
  } catch (e) { next(e); }
}

export async function updateResourceTask(req, res, next) {
  try {
    const item = await resourceTaskService.update(+req.params.id, req.body);
    if (!item) return res.status(404).json({ error: "not_found", message: "Resource task not found" });
    res.json(item);
  } catch (e) { next(e); }
}

export async function deleteResourceTask(req, res, next) {
  try {
    await resourceTaskService.remove(+req.params.id);
    res.status(204).end();
  } catch (e) { next(e); }
}
