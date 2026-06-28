import { useParams } from "react-router-dom";
import {
  BarChart, Bar, LineChart, Line, RadialBarChart, RadialBar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import PageHeader from "../../components/ui/PageHeader";
import KpiCard from "../../components/ui/KpiCard";
import ChartCard from "../../components/ui/ChartCard";
import { orderTrend, slaTrend, kpis } from "../../data/mock/index";

/**
 * KpiDashboard — Analytics & Reporting cross-portal dashboard.
 */
export default function KpiDashboard() {
  const { portalId } = useParams();

  const slaRadial = [
    { name: "Compliance", value: kpis.slaCompliance, fill: "#6bcb77" },
  ];

  return (
    <div style={{ minWidth: 920 }}>
      <PageHeader
        breadcrumb="Analytics & Reporting / Analytics / KPI Dashboard"
        title="KPI / SLA Dashboard"
        backTo={`/portal/${portalId}`}
      />

      <KpiCard
        items={[
          { label: "Open Orders", value: kpis.openOrders.toLocaleString(), color: "blue" },
          { label: "Exceptions", value: kpis.exceptions, color: "red" },
          { label: "Pending Tasks", value: kpis.pendingTasks, color: "yellow" },
          { label: "SLA Compliance", value: `${kpis.slaCompliance}%`, color: "green" },
        ]}
      />

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
        <ChartCard title="Weekly Order Throughput" subtitle="Orders completed vs exceptions">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={orderTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="orders" fill="#4d96ff" radius={[4, 4, 0, 0]} />
              <Bar dataKey="exceptions" fill="#ff6b6b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="SLA Compliance" subtitle="Current month">
          <ResponsiveContainer width="100%" height={280}>
            <RadialBarChart
              innerRadius="60%"
              outerRadius="100%"
              data={slaRadial}
              startAngle={90}
              endAngle={90 - (kpis.slaCompliance / 100) * 360}
            >
              <RadialBar background dataKey="value" cornerRadius={10} />
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle"
                fontSize="28" fontWeight="700" fill="#6bcb77">
                {kpis.slaCompliance}%
              </text>
            </RadialBarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="SLA Compliance Trend" subtitle="Monthly compliance over the year">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={slaTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis domain={[80, 100]} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Line type="monotone" dataKey="compliance" stroke="#6bcb77" strokeWidth={2.5} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
