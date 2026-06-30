import * as mplsBatchService from "../services/mplsBatchService.js";

export async function listMplsBatches(req, res, next) {
  try {
    const { page = 1, limit = 20, ...filter } = req.query;
    const result = await mplsBatchService.list({ filter, page: +page, limit: +limit });
    res.json(result);
  } catch (e) { next(e); }
}

export async function createMplsBatch(req, res, next) {
  try {
    const item = await mplsBatchService.create(req.body);
    res.status(201).json(item);
  } catch (e) { next(e); }
}

export async function getMplsBatch(req, res, next) {
  try {
    const item = await mplsBatchService.getById(+req.params.id);
    if (!item) return res.status(404).json({ error: "not_found", message: "MPLS batch not found" });
    res.json(item);
  } catch (e) { next(e); }
}

export async function updateMplsBatch(req, res, next) {
  try {
    const item = await mplsBatchService.update(+req.params.id, req.body);
    if (!item) return res.status(404).json({ error: "not_found", message: "MPLS batch not found" });
    res.json(item);
  } catch (e) { next(e); }
}

export async function deleteMplsBatch(req, res, next) {
  try {
    await mplsBatchService.remove(+req.params.id);
    res.status(204).end();
  } catch (e) { next(e); }
}
