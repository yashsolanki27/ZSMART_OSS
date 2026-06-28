import styles from "./StatusBadge.module.css";

/**
 * StatusBadge — renders coloured pills for status / priority / severity / bool / progress.
 * The `render` hint comes from column config in portals.js (e.g. "status", "priority", "severity").
 */
const CLASS_MAP = {
  // status values
  Normal: "normal", Active: "active", Completed: "completed", Healthy: "healthy",
  Compliant: "compliant", "On Track": "on-track", Acknowledged: "acknowledged",
  Exception: "exception", Critical: "critical", Breached: "breached", Escalated: "escalated",
  "At Risk": "at-risk", Failed: "failed", Locked: "locked",
  Warning: "warning", Pending: "pending", "In Progress": "in-progress",
  Investigating: "investigating", Degraded: "degraded", Scheduled: "scheduled",
  Disabled: "disabled", Running: "running", "Follow-up": "follow-up",
  Assigned: "assigned", Modified: "modified", Open: "open",
  Finished: "finished", Resolved: "resolved", Ok: "ok", Cleared: "cleared",
  Processing: "processing", Queued: "pending",
  Standby: "standby", Suppressed: "resolved",
  Rejected: "escalated", "Inactive": "minor",
  // priority (prefixed to avoid clash with severity "Critical")
};

export default function StatusBadge({ value, render }) {
  if (render === "progress") {
    const pct = typeof value === "number" ? value : parseInt(value, 10) || 0;
    return (
      <div className={styles["progress-bar-wrap"]}>
        <div className={styles["progress-bar-track"]}>
          <div
            className={styles["progress-bar-fill"]}
            style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
          />
        </div>
        <span className={styles["progress-bar-label"]}>{pct}%</span>
      </div>
    );
  }

  if (render === "bool") {
    return (
      <span className={`${styles.badge} ${styles[value ? "bool-true" : "bool-false"]}`}>
        {value ? "✓ Yes" : "✗ No"}
      </span>
    );
  }

  if (render === "num") {
    return <span>{typeof value === "number" ? value.toLocaleString() : value}</span>;
  }

  if (render === "priority") {
    const key = `priority-${(value || "").toLowerCase().replace(" ", "-")}`;
    return <span className={`${styles.badge} ${styles[key] || styles.normal}`}>{value}</span>;
  }

  if (render === "severity") {
    const key = `${(value || "").toLowerCase()}-sev`;
    return (
      <span className={`${styles.badge} ${styles[key] || styles[key.replace("-sev", "")] || styles.normal}`}>
        {value}
      </span>
    );
  }

  // status (default)
  const cls = CLASS_MAP[value] || styles.normal;
  return <span className={`${styles.badge} ${cls}`}>{value}</span>;
}
