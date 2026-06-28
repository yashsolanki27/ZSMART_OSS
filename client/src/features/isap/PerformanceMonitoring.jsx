import { useParams } from "react-router-dom";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import PageHeader from "../../components/ui/PageHeader";
import KpiCard from "../../components/ui/KpiCard";
import ChartCard from "../../components/ui/ChartCard";

// Deterministic mock time-series
const throughput = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
  mpls: Math.floor(Math.random() * 40) + 60,
  broadband: Math.floor(Math.random() * 50) + 50,
  voice: Math.floor(Math.random() * 20) + 80,
}));

const latency = Array.from({ length: 24 }, (_, h) => ({
  hour: `${String(h).padStart(2, "0")}:00`,
  avg: Math.floor(Math.random() * 15) + 5,
  p95: Math.floor(Math.random() * 25) + 15,
  p99: Math.floor(Math.random() * 30) + 30,
}));

const availability = [
  { name: "Broadband", value: 99.7 },
  { name: "Voice", value: 99.9 },
  { name: "MPLS", value: 99.95 },
  { name: "IPTV", value: 99.4 },
];

/**
 * PerformanceMonitoring — ISAP Portal dashboard for KPIs and
 * network performance metrics (throughput, latency, availability).
 */
export default function PerformanceMonitoring() {
  const { portalId } = useParams();

  return (
    <div style={{ minWidth: 920 }}>
      <PageHeader
        breadcrumb="ISAP Portal / Service Assurance / Performance Monitoring"
        title="Performance Monitoring"
        backTo={`/portal/${portalId}`}
      />

      <KpiCard
        items={[
          { label: "Avg Latency", value: "12ms", color: "green" },
          { label: "P95 Latency", value: "28ms", color: "blue" },
          { label: "Availability", value: "99.82%", color: "green" },
          { label: "Alerts", value: 3, color: "yellow" },
        ]}
      />

      <ChartCard title="Service Throughput (Monthly)" subtitle="Mbps by service type">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={throughput}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="broadband" fill="#4d96ff" radius={[3, 3, 0, 0]} />
            <Bar dataKey="mpls" fill="#6bcb77" radius={[3, 3, 0, 0]} />
            <Bar dataKey="voice" fill="#9d84b7" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
        <ChartCard title="Latency Distribution (24h)" subtitle="Average / P95 / P99 in ms">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={latency}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="p99" stackId="1" stroke="#ff6b6b" fill="#ffe5e5" />
              <Area type="monotone" dataKey="p95" stackId="1" stroke="#f0a500" fill="#fff5d6" />
              <Area type="monotone" dataKey="avg" stackId="1" stroke="#6bcb77" fill="#e5f5e9" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Service Availability" subtitle="Current month %">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={availability} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis type="number" domain={[98, 100]} tick={{ fontSize: 11 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={80} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="value" fill="#4d96ff" radius={[0, 4, 4, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
