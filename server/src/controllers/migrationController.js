import * as migrationService from "../services/migrationService.js";

export async function listMigrations(req, res, next) {
  try {
    const { page = 1, limit = 20, ...filter } = req.query;
    const result = await migrationService.list({ filter, page: +page, limit: +limit });
    res.json(result);
  } catch (e) { next(e); }
}

export async function createMigration(req, res, next) {
  try {
    const item = await migrationService.create(req.body);
    res.status(201).json(item);
  } catch (e) { next(e); }
}

export async function getMigration(req, res, next) {
  try {
    const item = await migrationService.getById(+req.params.id);
    if (!item) return res.status(404).json({ error: "not_found", message: "Migration not found" });
    res.json(item);
  } catch (e) { next(e); }
}

export async function updateMigration(req, res, next) {
  try {
    const item = await migrationService.update(+req.params.id, req.body);
    if (!item) return res.status(404).json({ error: "not_found", message: "Migration not found" });
    res.json(item);
  } catch (e) { next(e); }
}

export async function deleteMigration(req, res, next) {
  try {
    await migrationService.remove(+req.params.id);
    res.status(204).end();
  } catch (e) { next(e); }
}
