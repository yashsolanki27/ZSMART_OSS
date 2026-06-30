export function validate(schema) {
  return (req, res, next) => {
    const errors = [];
    if (schema.body) {
      for (const [field, rules] of Object.entries(schema.body)) {
        const value = req.body[field];
        if (rules.required && (value === undefined || value === null || value === "")) {
          errors.push(`${field} is required`);
        }
        if (rules.type === "string" && value !== undefined && typeof value !== "string") {
          errors.push(`${field} must be a string`);
        }
      }
    }
    if (errors.length > 0) {
      return res.status(400).json({ error: "validation_error", message: errors.join("; ") });
    }
    next();
  };
}
