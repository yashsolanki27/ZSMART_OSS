import * as auditLogService from "../services/auditLogService.js";

export async function listAuditLogs(req, res, next) {
  try {
    const { page = 1, limit = 20, ...filter } = req.query;
    const result = await auditLogService.list({ filter, page: +page, limit: +limit });
    res.json(result);
  } catch (e) { next(e); }
}

export async function createAuditLog(req, res, next) {
  try {
    const item = await auditLogService.create(req.body);
    res.status(201).json(item);
  } catch (e) { next(e); }
}

export async function getAuditLog(req, res, next) {
  try {
    const item = await auditLogService.getById(+req.params.id);
    if (!item) return res.status(404).json({ error: "not_found", message: "Audit log not found" });
    res.json(item);
  } catch (e) { next(e); }
}

export async function deleteAuditLog(req, res, next) {
  try {
    await auditLogService.remove(+req.params.id);
    res.status(204).end();
  } catch (e) { next(e); }
}
