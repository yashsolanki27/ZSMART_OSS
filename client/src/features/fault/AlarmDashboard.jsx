import { useParams } from "react-router-dom";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import PageHeader from "../../components/ui/PageHeader";
import KpiCard from "../../components/ui/KpiCard";
import ChartCard from "../../components/ui/ChartCard";
import { alarmTrend, alarms, incidents, kpis } from "../../data/mock/index";

const SEVERITY_COLORS = { critical: "#ff4d4d", major: "#f0a500", minor: "#4d96ff", warning: "#9d84b7" };
const SEV_DIST = ["Critical", "Major", "Minor", "Warning"].map((sev) => ({
  name: sev,
  value: alarms.filter((a) => a.severity === sev).length,
}));

/**
 * AlarmDashboard — Fault Management KPI dashboard.
 */
export default function AlarmDashboard() {
  const { portalId } = useParams();
  return (
    <div style={{ minWidth: 920 }}>
      <PageHeader
        breadcrumb="Fault Management Portal / Fault Mgr / Alarm Dashboard"
        title="Alarm Dashboard"
        backTo={`/portal/${portalId}`}
      />

      <KpiCard
        items={[
          { label: "Active Alarms", value: kpis.activeAlarms, color: "red", sub: "last 24h" },
          { label: "Critical", value: SEV_DIST[0].value, color: "red" },
          { label: "Open Incidents", value: kpis.openIncidents, color: "yellow" },
          { label: "Auto-cleared", value: 142, color: "green", sub: "this week" },
        ]}
      />

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
        <ChartCard title="Alarm Trend (24h)" subtitle="Active alarms by severity over time">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={alarmTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="critical" stackId="1" stroke="#ff4d4d" fill="#ffd5d5" />
              <Area type="monotone" dataKey="major" stackId="1" stroke="#f0a500" fill="#fff3cc" />
              <Area type="monotone" dataKey="minor" stackId="1" stroke="#4d96ff" fill="#d5e8ff" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Severity Distribution" subtitle="Current active alarms">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={SEV_DIST} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                {SEV_DIST.map((e) => (
                  <Cell key={e.name} fill={SEVERITY_COLORS[e.name.toLowerCase()]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Top Alarmed Devices" subtitle="Devices generating most alarms">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart
            data={Object.entries(
              alarms.reduce((acc, a) => ({ ...acc, [a.device]: (acc[a.device] || 0) + 1 }), {})
            ).map(([device, count]) => ({ device, count })).sort((a, b) => b.count - a.count).slice(0, 6)}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="device" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="count" fill="#4d96ff" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
