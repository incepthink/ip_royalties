import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import { FileText, CheckCircle, Package } from "lucide-react";
import { axiosManufacturer } from "@/lib/utils";

interface ActiveLicense {
  contract_name: string;
  ip_owner: string;
  quantity_agreed: number;
  royalty_owed: number;
}

interface RecentProposal {
  contract_name: string;
  product_quantity: number;
  date: string;
  status: string;
}

interface DashboardData {
  summary: {
    active_proposals: number;
    accepted_licenses: number;
    products_minted: number;
  };
  active_licenses: ActiveLicense[];
  recent_proposals: RecentProposal[];
}

export default function ManufacturerDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );

  useEffect(() => {
    axiosManufacturer("/user/ip-proposal/dashboard").then((res) =>
      setDashboardData(res.data.data),
    );
  }, []);

  const activeLicenses = dashboardData?.active_licenses ?? [];
  const recentProposals = dashboardData?.recent_proposals ?? [];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Your manufacturing overview
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Pending Proposals"
          value={dashboardData?.summary.active_proposals ?? 0}
          icon={FileText}
        />
        <StatCard
          label="Accepted Licenses"
          value={dashboardData?.summary.accepted_licenses ?? 0}
          icon={CheckCircle}
        />
        <StatCard
          label="Products Minted"
          value={dashboardData?.summary.products_minted ?? 0}
          icon={Package}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Active Licenses */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-card">
          <h2 className="font-semibold mb-4">Active Licenses</h2>
          {activeLicenses.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              You have no active licenses.
            </p>
          ) : (
            activeLicenses.map((license, i) => (
              <div key={i} className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Contract
                  </span>
                  <span className="text-sm font-medium">
                    {license.contract_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    IP Owner
                  </span>
                  <span className="text-sm font-medium">
                    {license.ip_owner}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Quantity Agreed
                  </span>
                  <span className="text-sm font-medium">
                    {license.quantity_agreed}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Royalty Owed
                  </span>
                  <span className="text-sm font-medium text-accent">
                    ${license.royalty_owed.toLocaleString()}
                  </span>
                </div>
                <Link
                  to="/manufacturer/products"
                  className="block text-center py-2 rounded-lg gradient-accent text-accent-foreground text-sm font-medium mt-3 hover:opacity-90 transition-opacity"
                >
                  View Products →
                </Link>
              </div>
            ))
          )}
        </div>

        {/* Recent Proposals */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-card">
          <h2 className="font-semibold mb-4">Recent Proposals</h2>
          {recentProposals.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              You have no recent proposals.
            </p>
          ) : (
            <div className="space-y-3">
              {recentProposals.map((proposal, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {proposal.contract_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {proposal.product_quantity} units •{" "}
                      {new Date(proposal.date).toLocaleDateString()}
                    </p>
                  </div>
                  <StatusBadge status={proposal.status} />
                </div>
              ))}
            </div>
          )}
          <Link
            to="/manufacturer/proposals"
            className="block text-center text-sm text-accent font-medium mt-4 hover:underline"
          >
            View All Proposals →
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
