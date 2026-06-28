import { useParams, useNavigate } from "react-router-dom";
import { getPortal } from "../config/portals";
import KpiCard from "../components/ui/KpiCard";
import { kpis } from "../data/mock/index";
import styles from "./PortalHome.module.css";

/**
 * PortalHome — generic card-grid landing page for each portal.
 * Reads modules from config/portals.js. Clicking a card navigates to the module.
 */
export default function PortalHome() {
  const { portalId } = useParams();
  const navigate = useNavigate();
  const portal = getPortal(portalId);

  if (!portal) {
    return <div className={styles.title}>Portal not found.</div>;
  }

  return (
    <div>
      <h1 className={styles.title}>{portal.name}</h1>
      <p className={styles.blurb}>{portal.blurb}</p>

      {portalId === "fault" || portalId === "analytics" ? (
        <div className={styles.kpisRow}>
          <KpiCard
            items={
              portalId === "fault"
                ? [
                    { label: "Active Alarms", value: kpis.activeAlarms, color: "red" },
                    { label: "Open Incidents", value: kpis.openIncidents, color: "yellow" },
                    { label: "SLA Compliance", value: `${kpis.slaCompliance}%`, color: "green" },
                  ]
                : [
                    { label: "Open Orders", value: kpis.openOrders, color: "blue" },
                    { label: "Exceptions", value: kpis.exceptions, color: "red" },
                    { label: "SLA Compliance", value: `${kpis.slaCompliance}%`, color: "green" },
                    { label: "Pending Tasks", value: kpis.pendingTasks, color: "purple" },
                  ]
            }
          />
        </div>
      ) : null}

      <div className={styles.grid}>
        {portal.modules.map((mod) => (
          <button
            key={mod.id}
            type="button"
            className={styles.card}
            onClick={() => navigate(`/portal/${portalId}/${mod.id}`)}
          >
            <div className={styles.icon}>{mod.icon}</div>
            <div className={styles.cardTitle}>{mod.title}</div>
            {mod.description && <div className={styles.cardDesc}>{mod.description}</div>}
          </button>
        ))}
      </div>
    </div>
  );
}
