import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import { FileText, CheckCircle, Package, Clock } from "lucide-react";
import { getManufacturerOrders } from "@/api";
import type { Order } from "@/api";

export default function ManufacturerDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => {
    getManufacturerOrders().then(setOrders);
  }, []);

  const accepted = orders.filter((o) => o.status === "Accepted");

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Your manufacturing overview
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Active Proposals" value={2} icon={FileText} />
        <StatCard label="Accepted Licenses" value={1} icon={CheckCircle} />
        <StatCard
          label="Products Received"
          value={480}
          icon={Package}
          trend="+48 this week"
        />
        <StatCard label="Pending Review" value={1} icon={Clock} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Active License */}
        {accepted.length > 0 && (
          <div className="bg-card rounded-xl border border-border p-6 shadow-card">
            <h2 className="font-semibold mb-4">Active License</h2>
            {accepted.map((o) => (
              <div key={o.id} className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Contract
                  </span>
                  <span className="text-sm font-medium">{o.contractName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    IP Owner
                  </span>
                  <span className="text-sm font-medium">{o.ownerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Quantity Agreed
                  </span>
                  <span className="text-sm font-medium">{o.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Minted</span>
                  <span className="text-sm font-medium">480</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Royalty Owed
                  </span>
                  <span className="text-sm font-medium text-accent">
                    $
                    {(
                      (o.quantity * o.estimatedUnitValue * o.royaltyCut) /
                      100
                    ).toLocaleString()}
                  </span>
                </div>
                <Link
                  to="/manufacturer/products"
                  className="block text-center py-2 rounded-lg gradient-accent text-accent-foreground text-sm font-medium mt-3 hover:opacity-90 transition-opacity"
                >
                  View Products →
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Recent proposals */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-card">
          <h2 className="font-semibold mb-4">Recent Proposals</h2>
          <div className="space-y-3">
            {orders.slice(0, 4).map((o) => (
              <div
                key={o.id}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <div>
                  <p className="text-sm font-medium">{o.contractName}</p>
                  <p className="text-xs text-muted-foreground">
                    {o.quantity} units • {o.createdAt}
                  </p>
                </div>
                <StatusBadge status={o.status} />
              </div>
            ))}
          </div>
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
