import { useState, useMemo } from "react";
import StatusBadge from "./StatusBadge";
import styles from "./DataTable.module.css";

const PAGE_SIZE = 15;

/**
 * DataTable — sortable, paginated, selectable table used on every OSS module page.
 * columns: [[key, label, render?], ...]   rows: [{key: value, ...}, ...]
 */
export default function DataTable({ columns = [], rows = [], actions = [], onRowClick }) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [selected, setSelected] = useState(new Set());
  const [page, setPage] = useState(1);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  };

  const sorted = useMemo(() => {
    if (!sortKey) return rows;
    return [...rows].sort((a, b) => {
      const va = a[sortKey] ?? "";
      const vb = b[sortKey] ?? "";
      const cmp = typeof va === "number" && typeof vb === "number" ? va - vb : String(va).localeCompare(String(vb));
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [rows, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const toggleRow = (idx) => {
    setSelected((prev) => {
      const next = new Set(prev);
      const realIdx = (safePage - 1) * PAGE_SIZE + idx;
      if (next.has(realIdx)) next.delete(realIdx);
      else next.add(realIdx);
      return next;
    });
  };

  return (
    <>
      <div className={styles.wrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: 30, cursor: "pointer" }} onClick={() => {
                if (selected.size === paged.length) setSelected(new Set());
                else setSelected(new Set(paged.map((_, i) => (safePage - 1) * PAGE_SIZE + i)));
              }}>
                <input type="checkbox" checked={selected.size > 0 && selected.size <= paged.length && paged.every((_, i) => selected.has((safePage - 1) * PAGE_SIZE + i))} readOnly />
              </th>
              {columns.map(([key, label]) => (
                <th key={key} onClick={() => handleSort(key)}>
                  {label}
                  <span className={`${styles["sort-arrow"]} ${sortKey === key ? styles.active : ""}`}>
                    {sortKey === key ? (sortDir === "asc" ? "▲" : "▼") : "⇅"}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className={styles.empty}>
                  No records found.
                </td>
              </tr>
            ) : (
              paged.map((row, ri) => (
                <tr
                  key={ri}
                  className={selected.has((safePage - 1) * PAGE_SIZE + ri) ? styles.selected : ""}
                  onClick={() => onRowClick?.(row)}
                  style={{ cursor: onRowClick ? "pointer" : undefined }}
                >
                  <td onClick={(e) => { e.stopPropagation(); toggleRow(ri); }}>
                    <input type="checkbox" checked={selected.has((safePage - 1) * PAGE_SIZE + ri)} readOnly />
                  </td>
                  {columns.map(([key, , render]) => (
                    <td key={key}>
                      {render ? <StatusBadge value={row[key]} render={render} /> : (row[key] ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>

        {sorted.length > PAGE_SIZE && (
          <div className={styles.pagination}>
            <span>Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, sorted.length)} of {sorted.length}</span>
            <div className={styles["page-btns"]}>
              <button disabled={safePage <= 1} onClick={() => setPage(1)}>«</button>
              <button disabled={safePage <= 1} onClick={() => setPage((p) => p - 1)}>‹</button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const start = Math.max(1, Math.min(safePage - 2, totalPages - 4));
                const pn = start + i;
                if (pn > totalPages) return null;
                return (
                  <button key={pn} className={pn === safePage ? styles.active : ""} onClick={() => setPage(pn)}>
                    {pn}
                  </button>
                );
              })}
              <button disabled={safePage >= totalPages} onClick={() => setPage((p) => p + 1)}>›</button>
              <button disabled={safePage >= totalPages} onClick={() => setPage(totalPages)}>»</button>
            </div>
          </div>
        )}
      </div>

      {actions.length > 0 && (
        <div className={styles["footer-actions"]}>
          {actions.map((label) => (
            <button key={label} type="button" onClick={() => alert(`${label} on ${selected.size} row(s)`)}>
              {label}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
