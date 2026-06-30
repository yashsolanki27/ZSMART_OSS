import * as bsnlRequestService from "../services/bsnlRequestService.js";

export async function listBsnlRequests(req, res, next) {
  try {
    const { page = 1, limit = 20, ...filter } = req.query;
    const result = await bsnlRequestService.list({ filter, page: +page, limit: +limit });
    res.json(result);
  } catch (e) { next(e); }
}

export async function createBsnlRequest(req, res, next) {
  try {
    const item = await bsnlRequestService.create(req.body);
    res.status(201).json(item);
  } catch (e) { next(e); }
}

export async function getBsnlRequest(req, res, next) {
  try {
    const item = await bsnlRequestService.getById(+req.params.id);
    if (!item) return res.status(404).json({ error: "not_found", message: "BSNL request not found" });
    res.json(item);
  } catch (e) { next(e); }
}

export async function updateBsnlRequest(req, res, next) {
  try {
    const item = await bsnlRequestService.update(+req.params.id, req.body);
    if (!item) return res.status(404).json({ error: "not_found", message: "BSNL request not found" });
    res.json(item);
  } catch (e) { next(e); }
}

export async function deleteBsnlRequest(req, res, next) {
  try {
    await bsnlRequestService.remove(+req.params.id);
    res.status(204).end();
  } catch (e) { next(e); }
}
