import * as alarmService from "../services/alarmService.js";

export async function listAlarms(req, res, next) {
  try {
    const { page = 1, limit = 20, ...filter } = req.query;
    const result = await alarmService.list({ filter, page: +page, limit: +limit });
    res.json(result);
  } catch (e) { next(e); }
}

export async function createAlarm(req, res, next) {
  try {
    const item = await alarmService.create(req.body);
    res.status(201).json(item);
  } catch (e) { next(e); }
}

export async function getAlarm(req, res, next) {
  try {
    const item = await alarmService.getById(+req.params.id);
    if (!item) return res.status(404).json({ error: "not_found", message: "Alarm not found" });
    res.json(item);
  } catch (e) { next(e); }
}

export async function updateAlarm(req, res, next) {
  try {
    const item = await alarmService.update(+req.params.id, req.body);
    if (!item) return res.status(404).json({ error: "not_found", message: "Alarm not found" });
    res.json(item);
  } catch (e) { next(e); }
}

export async function deleteAlarm(req, res, next) {
  try {
    await alarmService.remove(+req.params.id);
    res.status(204).end();
  } catch (e) { next(e); }
}
