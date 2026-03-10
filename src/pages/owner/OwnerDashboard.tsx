import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import {
  FileText,
  Users,
  Package,
  DollarSign,
  Plus,
  Eye,
  Clock,
} from "lucide-react";
import { axiosOwner } from "@/lib/utils";

interface RecentActivity {
  desc: string;
  date: string;
}

interface PendingProposal {
  [key: string]: unknown;
}

interface OwnerDashboardData {
  summary: {
    active_contracts: number;
    total_manufacturers: number;
    products_minted: number;
    revenue_owed: number;
  };
  recent_activity: RecentActivity[];
  pending_proposals: PendingProposal[];
}

export default function OwnerDashboard() {
  const [dashboardData, setDashboardData] = useState<OwnerDashboardData | null>(null);

  useEffect(() => {
    axiosOwner("/owner/ip-proposal/dashboard").then((res) =>
      setDashboardData(res.data.data)
    );
  }, []);

  const summary = dashboardData?.summary;
  const recentActivity = dashboardData?.recent_activity ?? [];
  const pendingProposals = dashboardData?.pending_proposals ?? [];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Welcome back. Here's what's happening with your IP.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Active Contracts"
          value={summary?.active_contracts ?? 0}
          icon={FileText}
        />
        <StatCard
          label="Total Manufacturers"
          value={summary?.total_manufacturers ?? 0}
          icon={Users}
        />
        <StatCard
          label="Products Minted"
          value={summary?.products_minted ?? 0}
          icon={Package}
        />
        <StatCard
          label="Revenue Owed"
          value={"$" + (summary?.revenue_owed ?? 0).toLocaleString()}
          subtitle="Based on agreed royalty %"
          icon={DollarSign}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6 shadow-card">
          <h2 className="font-semibold mb-4">Recent Activity</h2>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent activity.</p>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-0.5 p-1.5 rounded-lg bg-accent/10">
                    <Clock size={14} className="text-accent" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{a.desc}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(a.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Link
            to="/owner/contracts/new"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl gradient-accent text-accent-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            <Plus size={16} /> Create New Contract
          </Link>
          <Link
            to="/owner/proposals"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-border bg-card text-foreground font-semibold text-sm hover:bg-muted transition-colors"
          >
            <Eye size={16} /> View All Proposals
          </Link>

          <div className="bg-card rounded-xl border border-border p-5 shadow-card">
            <h3 className="font-semibold mb-3 text-sm">Pending Proposals</h3>
            {pendingProposals.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No pending proposals.
              </p>
            ) : (
              pendingProposals.slice(0, 3).map((p, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <p className="text-sm font-medium">{String(p.manufacturer_name ?? "")}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
