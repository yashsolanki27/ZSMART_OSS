import { useState } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "../../components/ui/PageHeader";
import { inventoryTree } from "../../data/mock/index";
import styles from "./InventoryManagement.module.css";

const SEV_LABEL = { ok: "Healthy", warning: "Warning", critical: "Critical" };
const SEV_COLOR = { ok: "#6bcb77", warning: "#f0a500", critical: "#ff4d4d" };

/**
 * InventoryManagement — hierarchical network resource catalog (IM Portal).
 * Left: expandable resource tree. Right: detail panel for the selected node.
 */
export default function InventoryManagement() {
  const { portalId } = useParams();
  const [selected, setSelected] = useState(null);
  const [openGroups, setOpenGroups] = useState(() =>
    Object.fromEntries(inventoryTree.children.map((c) => [c.name, true]))
  );

  const toggleGroup = (name) =>
    setOpenGroups((p) => ({ ...p, [name]: !p[name] }));

  const totalResources = inventoryTree.children.reduce(
    (sum, g) => sum + g.children.reduce((s, n) => s + n.count, 0),
    0
  );

  return (
    <div style={{ minWidth: 920 }}>
      <PageHeader
        breadcrumb="IM Portal / Inventory Mgr / Inventory Management"
        title="Inventory Management"
        backTo={`/portal/${portalId}`}
      />

      <div className={styles.layout}>
        {/* Resource tree */}
        <div className={styles.treeCard}>
          <div className={styles.treeTitle}>🗂️ Resource Catalog</div>

          <div className={styles.node} style={{ fontWeight: 600 }}>
            <span className={styles.chevron}>▾</span>
            📡 {inventoryTree.name}
            <span className={styles.count}>{totalResources.toLocaleString()}</span>
          </div>

          {inventoryTree.children.map((group) => (
            <div key={group.name}>
              <div
                className={`${styles.node} ${styles.indent}`}
                onClick={() => toggleGroup(group.name)}
              >
                <span className={styles.chevron}>{openGroups[group.name] ? "▾" : "▸"}</span>
                📁 {group.name}
              </div>

              {openGroups[group.name] &&
                group.children.map((leaf) => (
                  <div
                    key={leaf.name}
                    className={`${styles.node} ${styles.indent}`}
                    style={{ paddingLeft: 40 }}
                    onClick={() => setSelected(leaf)}
                  >
                    <span className={styles.chevron} />
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: SEV_COLOR[leaf.severity],
                        display: "inline-block",
                      }}
                    />
                    {leaf.name}
                    <span className={styles.count}>{leaf.count.toLocaleString()}</span>
                  </div>
                ))}
            </div>
          ))}
        </div>

        {/* Detail panel */}
        <div className={styles.detailCard}>
          {selected ? (
            <>
              <div className={styles.detailTitle}>{selected.name}</div>
              <div className={styles.detailSub}>
                Status:{" "}
                <strong style={{ color: SEV_COLOR[selected.severity] }}>
                  {SEV_LABEL[selected.severity]}
                </strong>
              </div>

              <div className={styles.statGrid}>
                <div className={styles.stat}>
                  <div className={styles.statVal}>{selected.count.toLocaleString()}</div>
                  <div className={styles.statLbl}>Total Units</div>
                </div>
                <div className={styles.stat}>
                  <div className={styles.statVal}>
                    {Math.floor(selected.count * 0.94).toLocaleString()}
                  </div>
                  <div className={styles.statLbl}>In Service</div>
                </div>
                <div className={styles.stat}>
                  <div className={styles.statVal}>
                    {Math.floor(selected.count * 0.04).toLocaleString()}
                  </div>
                  <div className={styles.statLbl}>Spare</div>
                </div>
                <div className={styles.stat}>
                  <div className={styles.statVal}>
                    {Math.floor(selected.count * 0.02).toLocaleString()}
                  </div>
                  <div className={styles.statLbl}>Faulty</div>
                </div>
              </div>

              <p style={{ fontSize: 13, color: "var(--color-text-muted)" }}>
                This resource group is part of the network inventory hierarchy. Click another
                node to inspect its capacity and health.
              </p>
            </>
          ) : (
            <div className={styles.emptyDetail}>
              👈 Select a resource node from the catalog to view details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
