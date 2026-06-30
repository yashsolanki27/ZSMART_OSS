import * as teamService from "../services/teamService.js";

export async function listTeams(req, res, next) {
  try {
    const { page = 1, limit = 20, ...filter } = req.query;
    const result = await teamService.list({ filter, page: +page, limit: +limit });
    res.json(result);
  } catch (e) { next(e); }
}

export async function createTeam(req, res, next) {
  try {
    const item = await teamService.create(req.body);
    res.status(201).json(item);
  } catch (e) { next(e); }
}

export async function getTeam(req, res, next) {
  try {
    const item = await teamService.getById(+req.params.id);
    if (!item) return res.status(404).json({ error: "not_found", message: "Team not found" });
    res.json(item);
  } catch (e) { next(e); }
}

export async function updateTeam(req, res, next) {
  try {
    const item = await teamService.update(+req.params.id, req.body);
    if (!item) return res.status(404).json({ error: "not_found", message: "Team not found" });
    res.json(item);
  } catch (e) { next(e); }
}

export async function deleteTeam(req, res, next) {
  try {
    await teamService.remove(+req.params.id);
    res.status(204).end();
  } catch (e) { next(e); }
}
