import { useParams } from "react-router-dom";
import PageHeader from "../../components/ui/PageHeader";
import KpiCard from "../../components/ui/KpiCard";
import styles from "./AlarmTopology.module.css";

/**
 * AlarmTopology — schematic network view with alarm hot-spots.
 * (Static SVG-based topology for Phase 1; can become interactive in Phase 2.)
 */
const NODES = [
  { id: "core", label: "Core Router", x: 50, y: 18, sev: "critical" },
  { id: "edge1", label: "Edge-DEL", x: 22, y: 45, sev: "major" },
  { id: "edge2", label: "Edge-MUM", x: 78, y: 45, sev: "ok" },
  { id: "edge3", label: "Edge-BLR", x: 50, y: 48, sev: "ok" },
  { id: "acc1", label: "OLT-North", x: 12, y: 78, sev: "minor" },
  { id: "acc2", label: "OLT-South", x: 38, y: 80, sev: "ok" },
  { id: "acc3", label: "OLT-East", x: 62, y: 80, sev: "warning" },
  { id: "acc4", label: "OLT-West", x: 88, y: 78, sev: "ok" },
];
const LINKS = [
  ["core", "edge1"], ["core", "edge2"], ["core", "edge3"],
  ["edge1", "acc1"], ["edge1", "acc2"],
  ["edge2", "acc3"], ["edge2", "acc4"],
  ["edge3", "acc2"], ["edge3", "acc3"],
];

const COLORS = { critical: "#ff4d4d", major: "#f0a500", minor: "#4d96ff", warning: "#9d84b7", ok: "#6bcb77" };

export default function AlarmTopology() {
  const { portalId } = useParams();
  const nodeMap = Object.fromEntries(NODES.map((n) => [n.id, n]));

  return (
    <div style={{ minWidth: 920 }}>
      <PageHeader
        breadcrumb="Fault Management Portal / Fault Mgr / Alarm Topology"
        title="Alarm Topology"
        backTo={`/portal/${portalId}`}
      />
      <KpiCard
        items={[
          { label: "Critical Nodes", value: NODES.filter((n) => n.sev === "critical").length, color: "red" },
          { label: "Major Nodes", value: NODES.filter((n) => n.sev === "major").length, color: "yellow" },
          { label: "Healthy Nodes", value: NODES.filter((n) => n.sev === "ok").length, color: "green" },
        ]}
      />
      <div className={styles.topologyCard}>
        <svg viewBox="0 0 100 100" className={styles.svg}>
          {LINKS.map(([a, b], i) => {
            const na = nodeMap[a], nb = nodeMap[b];
            const bad = na.sev === "critical" || nb.sev === "critical";
            return (
              <line key={i} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
                stroke={bad ? "#ff4d4d" : "#c5d0e0"} strokeWidth={bad ? 0.6 : 0.3}
                strokeDasharray={bad ? "1,1" : "none"} />
            );
          })}
          {NODES.map((n) => (
            <g key={n.id}>
              <circle cx={n.x} cy={n.y} r="3.2" fill={COLORS[n.sev]}
                className={n.sev !== "ok" ? styles.pulse : ""} style={{ "--c": COLORS[n.sev] }} />
              <text x={n.x} y={n.y - 4.5} textAnchor="middle" fontSize="2.4" fill="#333">{n.label}</text>
            </g>
          ))}
        </svg>
      </div>
      <div className={styles.legend}>
        {Object.entries(COLORS).map(([k, v]) => (
          <span key={k} className={styles.legendItem}>
            <span className={styles.dot} style={{ background: v }} /> {k}
          </span>
        ))}
      </div>
    </div>
  );
}
