import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { execSync } from "child_process";
import prisma from "./prismaClient.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

console.log(`[boot] PORT=${PORT} NODE_ENV=${process.env.NODE_ENV}`);

/* ---------- Global middleware ---------- */
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

/* ---------- Health endpoint ---------- */
app.get("/health", (req, res) => res.status(200).type("text").send("ok"));

/* ---------- Route imports ---------- */
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import roleRoutes from "./routes/roles.js";
import workgroupRoutes from "./routes/workgroups.js";
import orderRoutes from "./routes/orders.js";
import exceptionRoutes from "./routes/exceptions.js";
import taskRoutes from "./routes/tasks.js";
import serviceRoutes from "./routes/services.js";
import assuranceRoutes from "./routes/assurances.js";
import slaRoutes from "./routes/slas.js";
import ticketRoutes from "./routes/tickets.js";
import macRecordRoutes from "./routes/macRecords.js";
import migrationRoutes from "./routes/migrations.js";
import resourceOrderRoutes from "./routes/resourceOrders.js";
import resourceTaskRoutes from "./routes/resourceTasks.js";
import wfmTaskRoutes from "./routes/wfmTasks.js";
import teamRoutes from "./routes/teams.js";
import bsnlRequestRoutes from "./routes/bsnlRequests.js";
import mplsBatchRoutes from "./routes/mplsBatches.js";
import docketRoutes from "./routes/dockets.js";
import alarmRoutes from "./routes/alarms.js";
import incidentRoutes from "./routes/incidents.js";
import auditLogRoutes from "./routes/auditLogs.js";

/* ---------- Mount API routes ---------- */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/workgroups", workgroupRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/exceptions", exceptionRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/assurances", assuranceRoutes);
app.use("/api/slas", slaRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/mac-records", macRecordRoutes);
app.use("/api/migrations", migrationRoutes);
app.use("/api/resource-orders", resourceOrderRoutes);
app.use("/api/resource-tasks", resourceTaskRoutes);
app.use("/api/wfm-tasks", wfmTaskRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/bsnl-requests", bsnlRequestRoutes);
app.use("/api/mpls-batches", mplsBatchRoutes);
app.use("/api/dockets", docketRoutes);
app.use("/api/alarms", alarmRoutes);
app.use("/api/incidents", incidentRoutes);
app.use("/api/audit-logs", auditLogRoutes);

/* ---------- Error handlers ---------- */
import { errorHandler } from "./middleware/errorHandler.js";

app.use((req, res) => {
  res.status(404).json({ error: "Not found", path: req.originalUrl });
});

app.use(errorHandler);

/* ---------- Warm up DB connection pool ---------- */
const warmDb = prisma.$connect()
  .then(() => console.log("[db] PostgreSQL connected"))
  .catch((e) => console.warn("[db] Connection failed:", e.message));

/* ---------- Boot ---------- */
app.listen(PORT, "0.0.0.0", () => {
  console.log(`[boot] ZSMART OSS API ready on 0.0.0.0:${PORT}`);
});

/* Run pending migrations in background */
if (process.env.NODE_ENV === "production") {
  setTimeout(() => {
    try {
      execSync("npx prisma migrate deploy", { stdio: "inherit" });
      console.log("[migrate] Migrations applied");
    } catch (e) {
      console.error("[migrate] Failed:", e.message);
    }
  }, 2000);
}
