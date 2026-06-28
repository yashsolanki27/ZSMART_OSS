import { createContext, useContext, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

/**
 * PortalContext — tracks the active portal and exposes navigation
 * helpers used by the drawer + portal homes.
 */
const PortalContext = createContext(null);

export function PortalProvider({ children }) {
  const [activePortalId, setActivePortalId] = useState(null);

  const navigate = useNavigate();

  const selectPortal = useCallback(
    (portalId) => {
      setActivePortalId(portalId);
      navigate(`/portal/${portalId}`);
    },
    [navigate]
  );

  return (
    <PortalContext.Provider value={{ activePortalId, setActivePortalId, selectPortal }}>
      {children}
    </PortalContext.Provider>
  );
}

export function usePortal() {
  const ctx = useContext(PortalContext);
  if (!ctx) throw new Error("usePortal must be used within <PortalProvider>");
  return ctx;
}
