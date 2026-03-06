import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import StatusBadge from "@/components/StatusBadge";
import { getManufacturerOrders } from "@/api";
import type { Order } from "@/api";

export default function ManufacturerProposals() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("All");
  useEffect(() => {
    getManufacturerOrders().then(setOrders);
  }, []);

  const tabs = ["All", "Pending", "Accepted", "Rejected"];
  const filtered =
    filter === "All" ? orders : orders.filter((o) => o.status === filter);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-2">My Proposals</h1>
      <p className="text-muted-foreground text-sm mb-6">
        Track the status of your submitted proposals
      </p>

      <div className="flex gap-2 mb-6">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === t ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((o) => (
          <div
            key={o.id}
            className={`bg-card rounded-xl border border-border p-5 shadow-card transition-shadow ${o.status === "Rejected" ? "opacity-60" : "hover:shadow-card-hover"}`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold">{o.contractName}</h3>
                  <span className="text-xs text-muted-foreground">
                    by {o.ownerName}
                  </span>
                  <StatusBadge status={o.status} />
                </div>
                <p className="text-sm text-muted-foreground">
                  Product:{" "}
                  <span className="text-foreground font-medium">
                    {o.productName}
                  </span>
                </p>
                <div className="flex gap-6 mt-2 text-sm">
                  <span className="text-muted-foreground">
                    Qty:{" "}
                    <span className="text-foreground font-medium">
                      {o.quantity.toLocaleString()}
                    </span>
                  </span>
                  <span className="text-muted-foreground">
                    Date:{" "}
                    <span className="text-foreground font-medium">
                      {o.createdAt}
                    </span>
                  </span>
                </div>
              </div>
              {o.status === "Accepted" && (
                <Link
                  to="/manufacturer/products"
                  className="px-4 py-2 rounded-lg gradient-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  View My Products →
                </Link>
              )}
              {o.status === "Rejected" && (
                <Link
                  to={`/manufacturer/propose/${o.contractId}`}
                  className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
                >
                  Submit New Proposal
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
