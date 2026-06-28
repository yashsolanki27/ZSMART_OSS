import styles from "./ChartCard.module.css";

/**
 * ChartCard — titled container for Recharts visualisations on dashboards.
 */
export default function ChartCard({ title, subtitle, children, className = "" }) {
  return (
    <div className={`${styles.card} ${className}`}>
      {title && <div className={styles.title}>{title}</div>}
      {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
      <div className={styles.body}>{children}</div>
    </div>
  );
}
