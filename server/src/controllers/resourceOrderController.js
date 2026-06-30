import * as resourceOrderService from "../services/resourceOrderService.js";

export async function listResourceOrders(req, res, next) {
  try {
    const { page = 1, limit = 20, ...filter } = req.query;
    const result = await resourceOrderService.list({ filter, page: +page, limit: +limit });
    res.json(result);
  } catch (e) { next(e); }
}

export async function createResourceOrder(req, res, next) {
  try {
    const item = await resourceOrderService.create(req.body);
    res.status(201).json(item);
  } catch (e) { next(e); }
}

export async function getResourceOrder(req, res, next) {
  try {
    const item = await resourceOrderService.getById(+req.params.id);
    if (!item) return res.status(404).json({ error: "not_found", message: "Resource order not found" });
    res.json(item);
  } catch (e) { next(e); }
}

export async function updateResourceOrder(req, res, next) {
  try {
    const item = await resourceOrderService.update(+req.params.id, req.body);
    if (!item) return res.status(404).json({ error: "not_found", message: "Resource order not found" });
    res.json(item);
  } catch (e) { next(e); }
}

export async function deleteResourceOrder(req, res, next) {
  try {
    await resourceOrderService.remove(+req.params.id);
    res.status(204).end();
  } catch (e) { next(e); }
}
