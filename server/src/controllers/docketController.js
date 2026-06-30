import * as docketService from "../services/docketService.js";

export async function listDockets(req, res, next) {
  try {
    const { page = 1, limit = 20, ...filter } = req.query;
    const result = await docketService.list({ filter, page: +page, limit: +limit });
    res.json(result);
  } catch (e) { next(e); }
}

export async function createDocket(req, res, next) {
  try {
    const item = await docketService.create(req.body);
    res.status(201).json(item);
  } catch (e) { next(e); }
}

export async function getDocket(req, res, next) {
  try {
    const item = await docketService.getById(+req.params.id);
    if (!item) return res.status(404).json({ error: "not_found", message: "Docket not found" });
    res.json(item);
  } catch (e) { next(e); }
}

export async function updateDocket(req, res, next) {
  try {
    const item = await docketService.update(+req.params.id, req.body);
    if (!item) return res.status(404).json({ error: "not_found", message: "Docket not found" });
    res.json(item);
  } catch (e) { next(e); }
}

export async function deleteDocket(req, res, next) {
  try {
    await docketService.remove(+req.params.id);
    res.status(204).end();
  } catch (e) { next(e); }
}
