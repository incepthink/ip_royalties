import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import StatusBadge from "@/components/StatusBadge";
import { Plus } from "lucide-react";
import { getOwnerContracts } from "@/api";
import type { Contract } from "@/api";

export default function OwnerContracts() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  useEffect(() => {
    getOwnerContracts("owner1").then(setContracts);
  }, []);

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">My Contracts</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your IP license contracts
          </p>
        </div>
        <Link
          to="/owner/contracts/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg gradient-accent text-accent-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          <Plus size={16} /> Create New Contract
        </Link>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {contracts.map((c) => (
          <div
            key={c.id}
            className="bg-card rounded-xl border border-border overflow-hidden shadow-card hover:shadow-card-hover transition-shadow"
          >
            <img
              src={c.imageUrl}
              alt={c.name}
              className="w-full h-40 object-cover"
            />
            <div className="p-5">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-lg">{c.name}</h3>
                <StatusBadge status={c.status} />
              </div>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {c.description}
              </p>
              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                <div>
                  <span className="text-muted-foreground">Royalty:</span>{" "}
                  <span className="font-medium">{c.royaltyCut}%</span>
                </div>
                {c.manufacturerName && (
                  <div>
                    <span className="text-muted-foreground">Manufacturer:</span>{" "}
                    <span className="font-medium">{c.manufacturerName}</span>
                  </div>
                )}
              </div>
              {c.agreedQuantity > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Minted</span>
                    <span>
                      {c.mintedCount}/{c.agreedQuantity}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full gradient-accent rounded-full transition-all"
                      style={{
                        width: `${(c.mintedCount / c.agreedQuantity) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                <Link
                  to={`/owner/contracts/${c.id}`}
                  className="flex-1 text-center py-2 rounded-lg gradient-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  View Details
                </Link>
                <Link
                  to="/owner/proposals"
                  className="flex-1 text-center py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
                >
                  View Proposals
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
