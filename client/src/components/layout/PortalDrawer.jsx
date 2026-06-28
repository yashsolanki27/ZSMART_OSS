import { useState, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PORTAL_ORDER, getPortal } from "../../config/portals";
import styles from "./PortalDrawer.module.css";

/**
 * PortalDrawer — the 4-dot button + hover/click dropdown listing all portals.
 * Faithful to the reference screenshot (top-right of header).
 */
export default function PortalDrawer() {
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const timerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const visible = open || pinned;

  const show = useCallback(() => {
    clearTimeout(timerRef.current);
    setOpen(true);
  }, []);

  const scheduleHide = useCallback(() => {
    if (!pinned) {
      timerRef.current = setTimeout(() => setOpen(false), 200);
    }
  }, [pinned]);

  const togglePin = useCallback(() => {
    setPinned((p) => {
      const next = !p;
      setOpen(next);
      return next;
    });
  }, []);

  // Determine active portal from current route
  const match = location.pathname.match(/\/portal\/([^/]+)/);
  const activeId = match ? match[1] : null;

  const selectPortal = (portalId) => {
    setOpen(false);
    setPinned(false);
    navigate(`/portal/${portalId}`);
  };

  return (
    <div
      className={styles.wrapper}
      onMouseEnter={show}
      onMouseLeave={scheduleHide}
    >
      <button
        type="button"
        className={`${styles.dotsBtn} ${visible ? styles.active : ""}`}
        onClick={togglePin}
        title="Portals"
        aria-label="Open portal menu"
      >
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
      </button>

      <div
        className={`${styles.drawer} ${visible ? styles.open : ""}`}
        onMouseEnter={show}
        onMouseLeave={scheduleHide}
      >
        <div className={styles.drawerTitle}>Portals</div>
        {PORTAL_ORDER.map((pid) => {
          const portal = getPortal(pid);
          if (!portal) return null;
          return (
            <a
              key={pid}
              href="#"
              className={`${styles.link} ${activeId === pid ? styles.active : ""}`}
              onClick={(e) => {
                e.preventDefault();
                selectPortal(pid);
              }}
            >
              <span className={styles.linkIcon}>{portal.icon}</span>
              {portal.name}
            </a>
          );
        })}
      </div>
    </div>
  );
}
