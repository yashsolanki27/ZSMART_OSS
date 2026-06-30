import * as taskService from "../services/taskService.js";

export async function listTasks(req, res, next) {
  try {
    const { page = 1, limit = 20, ...filter } = req.query;
    const result = await taskService.list({ filter, page: +page, limit: +limit });
    res.json(result);
  } catch (e) { next(e); }
}

export async function createTask(req, res, next) {
  try {
    const item = await taskService.create(req.body);
    res.status(201).json(item);
  } catch (e) { next(e); }
}

export async function getTask(req, res, next) {
  try {
    const item = await taskService.getById(+req.params.id);
    if (!item) return res.status(404).json({ error: "not_found", message: "Task not found" });
    res.json(item);
  } catch (e) { next(e); }
}

export async function updateTask(req, res, next) {
  try {
    const item = await taskService.update(+req.params.id, req.body);
    if (!item) return res.status(404).json({ error: "not_found", message: "Task not found" });
    res.json(item);
  } catch (e) { next(e); }
}

export async function deleteTask(req, res, next) {
  try {
    await taskService.remove(+req.params.id);
    res.status(204).end();
  } catch (e) { next(e); }
}
