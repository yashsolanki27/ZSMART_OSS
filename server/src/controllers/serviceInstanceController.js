import * as serviceInstanceService from "../services/serviceInstanceService.js";

export async function listServiceInstances(req, res, next) {
  try {
    const { page = 1, limit = 20, ...filter } = req.query;
    const result = await serviceInstanceService.list({ filter, page: +page, limit: +limit });
    res.json(result);
  } catch (e) { next(e); }
}

export async function createServiceInstance(req, res, next) {
  try {
    const item = await serviceInstanceService.create(req.body);
    res.status(201).json(item);
  } catch (e) { next(e); }
}

export async function getServiceInstance(req, res, next) {
  try {
    const item = await serviceInstanceService.getById(+req.params.id);
    if (!item) return res.status(404).json({ error: "not_found", message: "Service instance not found" });
    res.json(item);
  } catch (e) { next(e); }
}

export async function updateServiceInstance(req, res, next) {
  try {
    const item = await serviceInstanceService.update(+req.params.id, req.body);
    if (!item) return res.status(404).json({ error: "not_found", message: "Service instance not found" });
    res.json(item);
  } catch (e) { next(e); }
}

export async function deleteServiceInstance(req, res, next) {
  try {
    await serviceInstanceService.remove(+req.params.id);
    res.status(204).end();
  } catch (e) { next(e); }
}
