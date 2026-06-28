import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PortalDrawer from "./PortalDrawer";
import styles from "./AppHeader.module.css";

/**
 * AppHeader — top bar with ZSMART brand, search, icons, avatar, logout,
 * and the 4-dot portal menu button that opens the PortalDrawer.
 */
export default function AppHeader() {
  const { user, logout } = useAuth();

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.brand}>
        <span className={styles.logo}>∞</span>
        ZSMART
      </Link>

      <div className={styles.right}>
        <div className={styles.search}>
          <input type="text" placeholder="Search..." />
        </div>

        <div className={styles.icons}>
          <button className={`${styles.iconBtn} ${styles["notif-dot"]}`} title="Notifications">
            🔔
          </button>
          <button className={styles.iconBtn} title="Settings">
            ⚙️
          </button>
        </div>

        <div className={styles.user}>
          <div className={styles.avatar}>{user?.initials || "U"}</div>
          <span className={styles.userName}>{user?.name || "User"}</span>
          <button className={styles.logout} onClick={logout}>
            Logout
          </button>
        </div>

        {/* 4-dot portal menu button + drawer */}
        <PortalDrawer />
      </div>
    </header>
  );
}
