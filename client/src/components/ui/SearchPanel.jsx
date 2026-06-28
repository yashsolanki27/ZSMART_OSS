import { useState } from "react";
import styles from "./SearchPanel.module.css";

/**
 * SearchPanel — the 3-col search grid + checkboxes + Query/Reset/Export
 * that appears on every OSS module page. Reads searchFields from config.
 */
export default function SearchPanel({ fields = [], actions = [], onFilter, extra }) {
  const [form, setForm] = useState(() => {
    const init = {};
    fields.forEach((f) => { init[f.key] = ""; });
    return init;
  });

  const change = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleQuery = () => onFilter?.(form);
  const handleReset = () => {
    const empty = {};
    fields.forEach((f) => { empty[f.key] = ""; });
    setForm(empty);
    onFilter?.(empty);
  };

  return (
    <div className={styles.panel}>
      <div className={styles.grid}>
        {fields.map((f) => (
          <label key={f.key} className={styles.field}>
            <span>{f.label}</span>
            {f.type === "select" ? (
              <select value={form[f.key] || ""} onChange={(e) => change(f.key, e.target.value)}>
                <option value="">—</option>
                {f.options?.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={form[f.key] || ""}
                onChange={(e) => change(f.key, e.target.value)}
                placeholder={f.label}
              />
            )}
          </label>
        ))}
      </div>

      <div className={styles.actions}>
        {extra}
        <div className={styles.checkboxes}>
          <label className={styles.checkbox}>
            <input type="checkbox" /> Warning
          </label>
          <label className={styles.checkbox}>
            <input type="checkbox" /> Timeout
          </label>
          <label className={styles.checkbox}>
            <input type="checkbox" defaultChecked /> Archive
          </label>
        </div>
        <button type="button" className={styles.primary} onClick={handleQuery}>
          Query
        </button>
        <button type="button" onClick={handleReset}>
          Reset
        </button>
        <button type="button" onClick={() => alert("Export triggered")}>
          Export
        </button>
      </div>
    </div>
  );
}
