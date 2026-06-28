import { Outlet, useParams, Link, useLocation } from "react-router-dom";
import AppHeader from "./AppHeader";
import { getPortal } from "../../config/portals";
import styles from "./AppShell.module.css";

/**
 * AppShell — the authenticated layout: header + sidebar + main content.
 * When at /portal/:portalId the left sidebar shows that portal's modules.
 */
export default function AppShell() {
  return (
    <div className={styles.shell}>
      <AppHeader />
      <AppBody />
    </div>
  );
}

function AppBody() {
  const { portalId } = useParams();
  const location = useLocation();
  const portal = getPortal(portalId);

  return (
    <div className={styles.content}>
      {/* Sidebar: show portal modules when inside a portal, else generic nav */}
      <nav className={styles.sidebar}>
        {portal ? (
          <>
            <div className={styles.sidebarLabel}>{portal.name}</div>
            {/* Home link */}
            <Link
              to={`/portal/${portalId}`}
              className={`${styles.sidebarLink} ${location.pathname === `/portal/${portalId}` ? styles.active : ""}`}
            >
              <span className={styles.sidebarLinkIcon}>🏠</span>
              Home
            </Link>
            {/* Module links */}
            {portal.modules.map((mod) => (
              <Link
                key={mod.id}
                to={`/portal/${portalId}/${mod.id}`}
                className={`${styles.sidebarLink} ${location.pathname === `/portal/${portalId}/${mod.id}` ? styles.active : ""}`}
              >
                <span className={styles.sidebarLinkIcon}>{mod.icon}</span>
                {mod.title}
              </Link>
            ))}
          </>
        ) : (
          <>
            <div className={styles.sidebarLabel}>Navigation</div>
            <Link to="/" className={`${styles.sidebarLink} ${location.pathname === "/" ? styles.active : ""}`}>
              <span className={styles.sidebarLinkIcon}>🏠</span> Dashboard
            </Link>
          </>
        )}
      </nav>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
