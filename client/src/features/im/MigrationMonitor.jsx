import { useParams } from "react-router-dom";
import PageHeader from "../../components/ui/PageHeader";
import KpiCard from "../../components/ui/KpiCard";
import ChartCard from "../../components/ui/ChartCard";
import DataTable from "../../components/ui/DataTable";
import { migrations } from "../../data/mock/index";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

const COLS = [
  ["migrationId", "Migration ID"],
  ["source", "Source"],
  ["target", "Target"],
  ["records", "Records", "num"],
  ["progress", "Progress", "progress"],
  ["status", "Status", "status"],
  ["scheduled", "Scheduled"],
];

const statusData = ["Scheduled", "Running", "Completed", "Failed"].map((s) => ({
  name: s,
  value: migrations.filter((m) => m.status === s).length,
}));

/**
 * MigrationMonitor — live migration overview used by IM and OFM portals.
 */
export default function MigrationMonitor() {
  const { portalId } = useParams();
  const totalRecs = migrations.reduce((s, m) => s + m.records, 0);
  const doneRecs = migrations.reduce(
    (s, m) => s + Math.floor((m.records * m.progress) / 100),
    0
  );

  return (
    <div style={{ minWidth: 920 }}>
      <PageHeader
        breadcrumb="Portal / Inventory / Migration Monitor"
        title="Migration Monitor"
        backTo={`/portal/${portalId}`}
      />

      <KpiCard
        items={[
          { label: "Active Migrations", value: migrations.filter((m) => m.status === "Running").length, color: "blue" },
          { label: "Total Records", value: totalRecs.toLocaleString(), color: "purple" },
          { label: "Records Migrated", value: doneRecs.toLocaleString(), color: "green" },
          { label: "Failed", value: migrations.filter((m) => m.status === "Failed").length, color: "red" },
        ]}
      />

      <ChartCard title="Migration Status Breakdown" subtitle="Count by lifecycle state">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={statusData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" fill="#4d96ff" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Migration Jobs" subtitle="Per-job progress">
        <DataTable columns={COLS} rows={migrations} />
      </ChartCard>
    </div>
  );
}
