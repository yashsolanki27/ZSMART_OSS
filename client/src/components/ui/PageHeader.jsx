import { useNavigate } from "react-router-dom";
import styles from "./PageHeader.module.css";

/**
 * PageHeader — breadcrumb + back button + title, as seen on every OSS module page.
 */
export default function PageHeader({ breadcrumb, title, backTo }) {
  const navigate = useNavigate();
  return (
    <div className={styles.header}>
      <button
        className={styles.back}
        type="button"
        onClick={() => (backTo ? navigate(backTo) : navigate(-1))}
      >
        ← Back
      </button>
      <div className={styles.heading}>
        {breadcrumb && <div className={styles.breadcrumb}>{breadcrumb}</div>}
        <h1>{title}</h1>
      </div>
    </div>
  );
}
