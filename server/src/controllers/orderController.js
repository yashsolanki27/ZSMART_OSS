import * as orderService from "../services/orderService.js";

export async function listOrders(req, res, next) {
  try {
    const { page = 1, limit = 20, ...filter } = req.query;
    const result = await orderService.list({ filter, page: +page, limit: +limit });
    res.json(result);
  } catch (e) { next(e); }
}

export async function createOrder(req, res, next) {
  try {
    const item = await orderService.create(req.body);
    res.status(201).json(item);
  } catch (e) { next(e); }
}

export async function getOrder(req, res, next) {
  try {
    const item = await orderService.getById(+req.params.id);
    if (!item) return res.status(404).json({ error: "not_found", message: "Order not found" });
    res.json(item);
  } catch (e) { next(e); }
}

export async function updateOrder(req, res, next) {
  try {
    const item = await orderService.update(+req.params.id, req.body);
    if (!item) return res.status(404).json({ error: "not_found", message: "Order not found" });
    res.json(item);
  } catch (e) { next(e); }
}

export async function deleteOrder(req, res, next) {
  try {
    await orderService.remove(+req.params.id);
    res.status(204).end();
  } catch (e) { next(e); }
}
