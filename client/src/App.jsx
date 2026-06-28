import { Routes, Route, Navigate, useLocation, useParams } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { PortalProvider } from "./context/PortalContext";
import { getModule } from "./config/portals";

import AppShell from "./components/layout/AppShell";
import LoginPage from "./features/auth/LoginPage";
import PortalHome from "./portals/PortalHome";
import ModuleListPage from "./portals/ModuleListPage";

// Special (hand-built) pages — keyed by the `component` field in config/portals.js
import AlarmDashboard from "./features/fault/AlarmDashboard";
import AlarmTopology from "./features/fault/AlarmTopology";
import InventoryManagement from "./features/im/InventoryManagement";
import MigrationMonitor from "./features/im/MigrationMonitor";
import BbnwReport from "./features/ofm/BbnwReport";
import KpiDashboard from "./features/analytics/KpiDashboard";
import PerformanceMonitoring from "./features/isap/PerformanceMonitoring";

/* ---------- Registry: config `component` name → React component ---------- */
// Adding a new special page = add one line here.
const SPECIAL_PAGES = {
  AlarmDashboard,
  AlarmTopology,
  InventoryManagement,
  MigrationMonitor,
  BbnwReport,
  KpiDashboard,
  PerformanceMonitoring,
};

/* ---------- Route guards ---------- */
function RequireAuth({ children }) {
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function RedirectIfAuth({ children }) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <Navigate to="/" replace /> : children;
}

/* ---------- Module resolver ----------
   Reads params + config to pick "list" (generic) vs "special" rendering.
   view: "list"    → ModuleListPage (generic table page)
   view: "special" → the component named in `component`
*/
function ModuleResolver() {
  const { portalId, moduleId } = useParams();
  const mod = getModule(portalId, moduleId);

  if (!mod) {
    return (
      <div style={{ padding: 40, color: "#666" }}>
        <h2>Module not found</h2>
        <p>The requested module could not be located.</p>
      </div>
    );
  }

  if (mod.view === "special" && mod.component) {
    const Special = SPECIAL_PAGES[mod.component];
    return Special ? <Special /> : <ModuleListPage />;
  }

  return <ModuleListPage />;
}

/* ---------- Root redirect: land inside the app shell when logged in ---------- */
function RootRedirect() {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? (
    <Navigate to="/portal/itc-admin" replace />
  ) : (
    <Navigate to="/login" replace />
  );
}

/* ---------- App root ---------- */
export default function App() {
  return (
    <AuthProvider>
      <PortalProvider>
        <Routes>
          {/* Public */}
          <Route
            path="/login"
            element={
              <RedirectIfAuth>
                <LoginPage />
              </RedirectIfAuth>
            }
          />

          {/* Authenticated app shell */}
          <Route
            element={
              <RequireAuth>
                <AppShell />
              </RequireAuth>
            }
          >
            <Route path="/" element={<RootRedirect />} />
            <Route path="/portal/:portalId" element={<PortalHome />} />
            <Route path="/portal/:portalId/:moduleId" element={<ModuleResolver />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PortalProvider>
    </AuthProvider>
  );
}
