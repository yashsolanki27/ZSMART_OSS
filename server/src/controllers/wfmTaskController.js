import * as wfmTaskService from "../services/wfmTaskService.js";

export async function listWfmTasks(req, res, next) {
  try {
    const { page = 1, limit = 20, ...filter } = req.query;
    const result = await wfmTaskService.list({ filter, page: +page, limit: +limit });
    res.json(result);
  } catch (e) { next(e); }
}

export async function createWfmTask(req, res, next) {
  try {
    const item = await wfmTaskService.create(req.body);
    res.status(201).json(item);
  } catch (e) { next(e); }
}

export async function getWfmTask(req, res, next) {
  try {
    const item = await wfmTaskService.getById(+req.params.id);
    if (!item) return res.status(404).json({ error: "not_found", message: "WFM task not found" });
    res.json(item);
  } catch (e) { next(e); }
}

export async function updateWfmTask(req, res, next) {
  try {
    const item = await wfmTaskService.update(+req.params.id, req.body);
    if (!item) return res.status(404).json({ error: "not_found", message: "WFM task not found" });
    res.json(item);
  } catch (e) { next(e); }
}

export async function deleteWfmTask(req, res, next) {
  try {
    await wfmTaskService.remove(+req.params.id);
    res.status(204).end();
  } catch (e) { next(e); }
}
