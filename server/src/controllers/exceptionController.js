import * as exceptionService from "../services/exceptionService.js";

export async function listExceptions(req, res, next) {
  try {
    const { page = 1, limit = 20, ...filter } = req.query;
    const result = await exceptionService.list({ filter, page: +page, limit: +limit });
    res.json(result);
  } catch (e) { next(e); }
}

export async function createException(req, res, next) {
  try {
    const item = await exceptionService.create(req.body);
    res.status(201).json(item);
  } catch (e) { next(e); }
}

export async function getException(req, res, next) {
  try {
    const item = await exceptionService.getById(+req.params.id);
    if (!item) return res.status(404).json({ error: "not_found", message: "Exception not found" });
    res.json(item);
  } catch (e) { next(e); }
}

export async function updateException(req, res, next) {
  try {
    const item = await exceptionService.update(+req.params.id, req.body);
    if (!item) return res.status(404).json({ error: "not_found", message: "Exception not found" });
    res.json(item);
  } catch (e) { next(e); }
}

export async function deleteException(req, res, next) {
  try {
    await exceptionService.remove(+req.params.id);
    res.status(204).end();
  } catch (e) { next(e); }
}
