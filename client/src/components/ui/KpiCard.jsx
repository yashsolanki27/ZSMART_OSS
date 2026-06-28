import styles from "./KpiCard.module.css";

export default function KpiCard({ items = [] }) {
  return (
    <div className={styles.grid}>
      {items.map((item, i) => (
        <div key={i} className={`${styles.card} ${styles[item.color || "blue"]}`}>
          <div className={styles.label}>{item.label}</div>
          <div className={styles.value}>{item.value}</div>
          {item.sub && <div className={styles.sub}>{item.sub}</div>}
        </div>
      ))}
    </div>
  );
}
