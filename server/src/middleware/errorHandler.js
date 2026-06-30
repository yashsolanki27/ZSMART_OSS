export function errorHandler(err, req, res, next) {
  console.error("[ERROR]", err.name, err.message);

  if (err.code === "P2002") {
    return res.status(409).json({ error: "conflict", message: "A record with this value already exists" });
  }
  if (err.code === "P2025") {
    return res.status(404).json({ error: "not_found", message: "Record not found" });
  }
  if (err.name === "PrismaClientValidationError") {
    return res.status(400).json({ error: "validation_error", message: err.message });
  }

  const status = err.status || 500;
  res.status(status).json({
    error: err.code || "internal_error",
    message: err.message || "Something went wrong",
  });
}
