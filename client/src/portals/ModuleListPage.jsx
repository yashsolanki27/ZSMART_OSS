import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getPortal, getModule } from "../config/portals";
import PageHeader from "../components/ui/PageHeader";
import SearchPanel from "../components/ui/SearchPanel";
import DataTable from "../components/ui/DataTable";
import styles from "./ModuleListPage.module.css";

/**
 * ModuleListPage — the universal "list" page that powers ~30 module screens
 * (Order Desk, Exception Monitoring, Users, Alarms, etc.). All data comes
 * from config/portals.js → { columns, searchFields, rows, actions }.
 * Includes client-side filtering driven by the SearchPanel.
 */
export default function ModuleListPage() {
  const { portalId, moduleId } = useParams();
  const portal = getPortal(portalId);
  const mod = getModule(portalId, moduleId);
  const [filters, setFilters] = useState({});

  const filteredRows = useMemo(() => {
    if (!mod?.rows) return [];
    const active = Object.entries(filters).filter(([, v]) => v && String(v).trim());
    if (active.length === 0) return mod.rows;
    return mod.rows.filter((row) =>
      active.every(([key, val]) => {
        const cell = row[key];
        return cell != null && String(cell).toLowerCase().includes(String(val).toLowerCase());
      })
    );
  }, [mod, filters]);

  if (!mod) {
    return <div className={styles.title}>Module not found.</div>;
  }

  return (
    <div className={styles.page}>
      <PageHeader
        breadcrumb={`${portal.name} / ${portal.name.split(" ")[0]} / ${mod.title}`}
        title={mod.title}
        backTo={`/portal/${portalId}`}
      />

      {mod.description && (
        <p className={styles.desc}>{mod.description}</p>
      )}

      <SearchPanel
        fields={mod.searchFields || []}
        actions={mod.actions || []}
        onFilter={setFilters}
      />

      <div className={styles.tableWrap}>
        <DataTable
          columns={mod.columns || []}
          rows={filteredRows}
          actions={mod.actions || []}
          onRowClick={(row) => alert(JSON.stringify(row, null, 2))}
        />
      </div>

      <div className={styles.resultCount}>
        {filteredRows.length} record{filteredRows.length !== 1 ? "s" : ""} found
      </div>
    </div>
  );
}
