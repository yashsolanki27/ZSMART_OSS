import * as slaService from "../services/slaService.js";

export async function listSlas(req, res, next) {
  try {
    const { page = 1, limit = 20, ...filter } = req.query;
    const result = await slaService.list({ filter, page: +page, limit: +limit });
    res.json(result);
  } catch (e) { next(e); }
}

export async function createSla(req, res, next) {
  try {
    const item = await slaService.create(req.body);
    res.status(201).json(item);
  } catch (e) { next(e); }
}

export async function getSla(req, res, next) {
  try {
    const item = await slaService.getById(+req.params.id);
    if (!item) return res.status(404).json({ error: "not_found", message: "SLA not found" });
    res.json(item);
  } catch (e) { next(e); }
}

export async function updateSla(req, res, next) {
  try {
    const item = await slaService.update(+req.params.id, req.body);
    if (!item) return res.status(404).json({ error: "not_found", message: "SLA not found" });
    res.json(item);
  } catch (e) { next(e); }
}

export async function deleteSla(req, res, next) {
  try {
    await slaService.remove(+req.params.id);
    res.status(204).end();
  } catch (e) { next(e); }
}
