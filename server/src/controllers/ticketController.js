import * as ticketService from "../services/ticketService.js";

export async function listTickets(req, res, next) {
  try {
    const { page = 1, limit = 20, ...filter } = req.query;
    const result = await ticketService.list({ filter, page: +page, limit: +limit });
    res.json(result);
  } catch (e) { next(e); }
}

export async function createTicket(req, res, next) {
  try {
    const item = await ticketService.create(req.body);
    res.status(201).json(item);
  } catch (e) { next(e); }
}

export async function getTicket(req, res, next) {
  try {
    const item = await ticketService.getById(+req.params.id);
    if (!item) return res.status(404).json({ error: "not_found", message: "Ticket not found" });
    res.json(item);
  } catch (e) { next(e); }
}

export async function updateTicket(req, res, next) {
  try {
    const item = await ticketService.update(+req.params.id, req.body);
    if (!item) return res.status(404).json({ error: "not_found", message: "Ticket not found" });
    res.json(item);
  } catch (e) { next(e); }
}

export async function deleteTicket(req, res, next) {
  try {
    await ticketService.remove(+req.params.id);
    res.status(204).end();
  } catch (e) { next(e); }
}
