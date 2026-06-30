import * as incidentService from "../services/incidentService.js";

export async function listIncidents(req, res, next) {
  try {
    const { page = 1, limit = 20, ...filter } = req.query;
    const result = await incidentService.list({ filter, page: +page, limit: +limit });
    res.json(result);
  } catch (e) { next(e); }
}

export async function createIncident(req, res, next) {
  try {
    const item = await incidentService.create(req.body);
    res.status(201).json(item);
  } catch (e) { next(e); }
}

export async function getIncident(req, res, next) {
  try {
    const item = await incidentService.getById(+req.params.id);
    if (!item) return res.status(404).json({ error: "not_found", message: "Incident not found" });
    res.json(item);
  } catch (e) { next(e); }
}

export async function updateIncident(req, res, next) {
  try {
    const item = await incidentService.update(+req.params.id, req.body);
    if (!item) return res.status(404).json({ error: "not_found", message: "Incident not found" });
    res.json(item);
  } catch (e) { next(e); }
}

export async function deleteIncident(req, res, next) {
  try {
    await incidentService.remove(+req.params.id);
    res.status(204).end();
  } catch (e) { next(e); }
}
