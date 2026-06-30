import { useMemo, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPortal, getModule } from "../config/portals";
import { api } from "../api";
import { moduleApiMap } from "../config/moduleApiMap";
import PageHeader from "../components/ui/PageHeader";
import SearchPanel from "../components/ui/SearchPanel";
import DataTable from "../components/ui/DataTable";
import styles from "./ModuleListPage.module.css";

export default function ModuleListPage() {
  const { portalId, moduleId } = useParams();
  const portal = getPortal(portalId);
  const mod = getModule(portalId, moduleId);
  const [filters, setFilters] = useState({});
  const [apiRows, setApiRows] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const apiKey = moduleApiMap[moduleId];
    if (!apiKey || !api[apiKey]) {
      setApiRows(null);
      return;
    }
    setLoading(true);
    api[apiKey].list()
      .then((res) => setApiRows(res.items))
      .catch(() => setApiRows(null))
      .finally(() => setLoading(false));
  }, [moduleId]);

  const rows = apiRows || mod?.rows || [];

  const filteredRows = useMemo(() => {
    const active = Object.entries(filters).filter(([, v]) => v && String(v).trim());
    if (active.length === 0) return rows;
    return rows.filter((row) =>
      active.every(([key, val]) => {
        const cell = row[key];
        return cell != null && String(cell).toLowerCase().includes(String(val).toLowerCase());
      })
    );
  }, [rows, filters]);

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
        {loading ? (
          <div className={styles.loading}>Loading...</div>
        ) : (
          <DataTable
            columns={mod.columns || []}
            rows={filteredRows}
            actions={mod.actions || []}
            onRowClick={(row) => alert(JSON.stringify(row, null, 2))}
          />
        )}
      </div>

      <div className={styles.resultCount}>
        {filteredRows.length} record{filteredRows.length !== 1 ? "s" : ""} found
        {apiRows && " (live)"}
      </div>
    </div>
  );
}
