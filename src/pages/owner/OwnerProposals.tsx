import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import StatusBadge from "@/components/StatusBadge";
import { getOrdersForOwner, acceptOrder, rejectOrder } from "@/api";
import type { Order } from "@/api";
import { CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

export default function OwnerProposals() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState("All");
  const [confirmModal, setConfirmModal] = useState<Order | null>(null);

  useEffect(() => {
    getOrdersForOwner("owner1").then(setOrders);
  }, []);

  const filtered =
    filter === "All" ? orders : orders.filter((o) => o.status === filter);
  const tabs = ["All", "Pending", "Accepted", "Rejected"];

  const handleAccept = async (order: Order) => {
    try {
      await acceptOrder(order.id);
      setOrders((prev) =>
        prev.map((o) =>
          o.id === order.id ? { ...o, status: "Accepted" as const } : o,
        ),
      );
      setConfirmModal(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to accept order");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectOrder(id);
      setOrders((prev) =>
        prev.map((o) =>
          o.id === id ? { ...o, status: "Rejected" as const } : o,
        ),
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to reject order");
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-2">Proposals</h1>
      <p className="text-muted-foreground text-sm mb-6">
        Review and manage manufacturer proposals
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
            className="bg-card rounded-xl border border-border p-5 shadow-card hover:shadow-card-hover transition-shadow"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold">{o.manufacturerName}</h3>
                  <StatusBadge status={o.status} />
                </div>
                <p className="text-sm text-muted-foreground">
                  Contract:{" "}
                  <span className="text-foreground font-medium">
                    {o.contractName}
                  </span>
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Product:</span>{" "}
                    <span className="font-medium">{o.productName}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Quantity:</span>{" "}
                    <span className="font-medium">
                      {o.quantity.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Intended Use:</span>{" "}
                    <span className="font-medium">
                      {o.intendedUse.slice(0, 40)}...
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Date:</span>{" "}
                    <span className="font-medium">{o.createdAt}</span>
                  </div>
                </div>
              </div>
              {o.status === "Pending" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setConfirmModal(o)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-success text-success-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    <CheckCircle size={14} /> Accept
                  </button>
                  <button
                    onClick={() => handleReject(o.id)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    <XCircle size={14} /> Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl border border-border p-6 max-w-md w-full shadow-lg">
            <h2 className="text-lg font-bold mb-2">Confirm Acceptance</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Are you sure?{" "}
              <span className="font-medium text-foreground">
                {confirmModal.quantity.toLocaleString()} units
              </span>{" "}
              will be minted to{" "}
              <span className="font-mono text-xs">
                {confirmModal.walletAddress.slice(0, 10)}...
                {confirmModal.walletAddress.slice(-4)}
              </span>
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmModal(null)}
                className="flex-1 py-2.5 rounded-lg border border-border font-medium text-sm hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAccept(confirmModal)}
                className="flex-1 py-2.5 rounded-lg bg-success text-success-foreground font-medium text-sm hover:opacity-90 transition-opacity"
              >
                Confirm & Mint
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
