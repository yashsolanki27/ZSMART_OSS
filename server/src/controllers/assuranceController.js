import * as assuranceService from "../services/assuranceService.js";

export async function listAssurances(req, res, next) {
  try {
    const { page = 1, limit = 20, ...filter } = req.query;
    const result = await assuranceService.list({ filter, page: +page, limit: +limit });
    res.json(result);
  } catch (e) { next(e); }
}

export async function createAssurance(req, res, next) {
  try {
    const item = await assuranceService.create(req.body);
    res.status(201).json(item);
  } catch (e) { next(e); }
}

export async function getAssurance(req, res, next) {
  try {
    const item = await assuranceService.getById(+req.params.id);
    if (!item) return res.status(404).json({ error: "not_found", message: "Assurance not found" });
    res.json(item);
  } catch (e) { next(e); }
}

export async function updateAssurance(req, res, next) {
  try {
    const item = await assuranceService.update(+req.params.id, req.body);
    if (!item) return res.status(404).json({ error: "not_found", message: "Assurance not found" });
    res.json(item);
  } catch (e) { next(e); }
}

export async function deleteAssurance(req, res, next) {
  try {
    await assuranceService.remove(+req.params.id);
    res.status(204).end();
  } catch (e) { next(e); }
}
