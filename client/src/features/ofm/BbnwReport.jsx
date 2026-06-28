import { useParams } from "react-router-dom";
import PageHeader from "../../components/ui/PageHeader";
import KpiCard from "../../components/ui/KpiCard";
import ChartCard from "../../components/ui/ChartCard";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

const utilization = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => ({
  day,
  upstream: Math.floor(Math.random() * 30) + 55,
  downstream: Math.floor(Math.random() * 25) + 65,
}));

const sites = ["DEL-NOC", "MUM-CORE", "BLR-EDGE", "CHN-AGG", "KOL-ACC", "HYD-TR"].map((site) => ({
  site,
  links: Math.floor(Math.random() * 40) + 10,
  uptime: Math.floor(Math.random() * 4) + 96,
}));

/**
 * BbnwReport — Backhaul Network weekly report (OFM Portal).
 */
export default function BbnwReport() {
  const { portalId } = useParams();

  return (
    <div style={{ minWidth: 920 }}>
      <PageHeader
        breadcrumb="OFM Portal / Field Ops / BBNW Report"
        title="BBNW Report"
        backTo={`/portal/${portalId}`}
      />

      <KpiCard
        items={[
          { label: "Total Sites", value: sites.length, color: "blue" },
          { label: "Avg Uptime", value: `${Math.floor(sites.reduce((s, x) => s + x.uptime, 0) / sites.length)}%`, color: "green" },
          { label: "Active Links", value: sites.reduce((s, x) => s + x.links, 0), color: "purple" },
          { label: "Degraded", value: 2, color: "red" },
        ]}
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <ChartCard title="Bandwidth Utilization (7 days)" subtitle="Upstream vs downstream %">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={utilization}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="upstream" stroke="#4d96ff" strokeWidth={2} />
              <Line type="monotone" dataKey="downstream" stroke="#6bcb77" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Links per Site" subtitle="Backhaul link count">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={sites}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="site" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="links" fill="#9d84b7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Site Uptime Summary" subtitle="Weekly uptime per site">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={sites} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis type="number" domain={[90, 100]} tick={{ fontSize: 11 }} />
            <YAxis dataKey="site" type="category" tick={{ fontSize: 11 }} width={80} />
            <Tooltip />
            <Bar dataKey="uptime" fill="#6bcb77" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
