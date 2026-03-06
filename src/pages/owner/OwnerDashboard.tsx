import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import {
  FileText,
  Users,
  Package,
  DollarSign,
  Plus,
  Eye,
  Clock,
} from "lucide-react";
import { getOwnerContracts, getOrdersForOwner } from "@/api";
import type { Contract, Order } from "@/api";

export default function OwnerDashboard() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    getOwnerContracts("owner1").then(setContracts);
    getOrdersForOwner("owner1").then(setOrders);
  }, []);

  const totalMinted = contracts.reduce((s, c) => s + c.mintedCount, 0);

  const activities = [
    {
      text: "Nike Corp submitted a proposal for Heritage Crest",
      time: "2 hours ago",
      type: "proposal",
    },
    {
      text: "Vintage Works proposal for Retro Wave Artwork is pending review",
      time: "1 day ago",
      type: "pending",
    },
    {
      text: "Air Logo License reached 480/500 minted products",
      time: "2 days ago",
      type: "milestone",
    },
    {
      text: "Signature Pattern V2 contract completed — 200/200 minted",
      time: "1 week ago",
      type: "completed",
    },
  ];

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
          value={4}
          icon={FileText}
          trend="+2 this month"
        />
        <StatCard label="Total Manufacturers" value={7} icon={Users} />
        <StatCard
          label="Products Minted"
          value={totalMinted.toLocaleString()}
          icon={Package}
          trend="+120 this week"
        />
        <StatCard
          label="Revenue Owed"
          value="$18,400"
          subtitle="Based on agreed royalty %"
          icon={DollarSign}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6 shadow-card">
          <h2 className="font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {activities.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-0.5 p-1.5 rounded-lg bg-accent/10">
                  <Clock size={14} className="text-accent" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">{a.text}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {a.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
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
            {orders
              .filter((o) => o.status === "Pending")
              .slice(0, 3)
              .map((o) => (
                <div
                  key={o.id}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium">{o.manufacturerName}</p>
                    <p className="text-xs text-muted-foreground">
                      {o.contractName}
                    </p>
                  </div>
                  <StatusBadge status={o.status} />
                </div>
              ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
