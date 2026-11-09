import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import StatusBadge from "@/components/StatusBadge";
import { getContractById, getContractNFTs, getOwnerIpProposals } from "@/api";
import type { Contract, NFT, IpProposal } from "@/api";
import { formatDate, txExplorerUrl } from "@/lib/utils";
import { CheckCircle, XCircle, ExternalLink } from "lucide-react";

export default function ContractDetail() {
  const { id } = useParams();
  const [contract, setContract] = useState<Contract | null>(null);
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [proposals, setProposals] = useState<IpProposal[]>([]);

  useEffect(() => {
    if (id) {
      getContractById(id).then(setContract);
      getContractNFTs(id).then(setNfts);
      getOwnerIpProposals().then((all) =>
        setProposals(all.filter((p) => p.ip_contract_id === id)),
      );
    }
  }, [id]);

  if (!contract)
    return (
      <DashboardLayout>
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </DashboardLayout>
    );

  // Units are minted when a proposal is accepted
  const accepted = proposals.filter((p) => p.status === "Accepted");
  const agreedQuantity = accepted.reduce((sum, p) => sum + p.quantity, 0);
  const mintedCount = accepted
    .filter((p) => p.transaction_hash)
    .reduce((sum, p) => sum + p.quantity, 0);
  const progress = agreedQuantity > 0 ? (mintedCount / agreedQuantity) * 100 : 0;
  const revenueOwed = accepted.reduce((sum, p) => sum + Number(p.total_royalty_owed || 0), 0);
  const grossValue = accepted.reduce(
    (sum, p) => sum + p.quantity * Number(p.estimated_unit_value || 0),
    0,
  );
  const latest = accepted[accepted.length - 1];

  return (
    <DashboardLayout>
      <div className="grid lg:grid-cols-5 gap-8">
        {/* Left */}
        <div className="lg:col-span-3 space-y-6">
          <img
            src={contract.imageUrl}
            alt={contract.name}
            className="w-full h-64 object-cover rounded-xl"
          />
          <div className="bg-card rounded-xl border border-border p-6 shadow-card">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-2xl font-bold">{contract.name}</h1>
              <StatusBadge status={contract.status} />
            </div>
            <p className="text-muted-foreground mb-6">{contract.description}</p>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold mb-2">
                  Allowed Use Cases
                </h3>
                <ul className="space-y-1">
                  {contract.allowedUseCases.map((u, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle size={14} className="text-success" />
                      {u}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-2">Restrictions</h3>
                <ul className="space-y-1">
                  {contract.restrictions.map((r, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <XCircle size={14} className="text-destructive" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-3 border-t border-border">
                <span className="text-sm text-muted-foreground">
                  Royalty Rate:
                </span>
                <span className="ml-2 text-lg font-bold text-accent">
                  {contract.royaltyCut}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="lg:col-span-2 space-y-6">
          {latest && (
            <div className="bg-card rounded-xl border border-border p-6 shadow-card">
              <h3 className="font-semibold mb-3">Manufacturer</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name</span>
                  <span className="font-medium">
                    {latest.manufacturer_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Product</span>
                  <span className="font-medium">{latest.product_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Wallet</span>
                  <span className="font-mono text-xs">
                    {latest.wallet_address.slice(0, 6)}...{latest.wallet_address.slice(-4)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Accepted</span>
                  <span className="font-medium">
                    {formatDate(latest.minted_at || latest.createdAt)}
                  </span>
                </div>
                {accepted.length > 1 && (
                  <p className="text-xs text-muted-foreground pt-1">
                    +{accepted.length - 1} more accepted proposal(s)
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="bg-card rounded-xl border border-border p-6 shadow-card">
            <h3 className="font-semibold mb-4">Minting Progress</h3>
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-32 h-32">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="hsl(var(--muted))"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="hsl(var(--accent))"
                    strokeWidth="8"
                    strokeDasharray={`${progress * 2.51} 251`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold">
                    {Math.round(progress)}%
                  </span>
                </div>
              </div>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              {mintedCount.toLocaleString()} / {agreedQuantity.toLocaleString()} products minted
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6 shadow-card">
            <h3 className="font-semibold mb-2">Revenue Owed</h3>
            <p className="text-3xl font-bold text-accent">
              ${revenueOwed.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              ${grossValue.toLocaleString()} product value × {contract.royaltyCut}%
            </p>
          </div>
        </div>
      </div>

      {/* NFT Table */}
      <div className="mt-8 bg-card rounded-xl border border-border shadow-card overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="font-semibold">Product Tracking</h2>
          <p className="text-sm text-muted-foreground">
            On-chain records for all manufactured products
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Token ID
                </th>
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Minted Date
                </th>
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Transaction Hash
                </th>
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {nfts.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-muted-foreground">
                    No products minted yet. Accept a proposal to mint.
                  </td>
                </tr>
              )}
              {nfts.map((n, i) => (
                <tr
                  key={i}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="p-4 font-mono font-medium">{n.tokenId}</td>
                  <td className="p-4 text-muted-foreground">{formatDate(n.mintedDate)}</td>
                  <td className="p-4">
                    {n.transactionHash ? (
                      <a
                        href={txExplorerUrl(n.transactionHash)}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-xs text-accent hover:underline inline-flex items-center gap-1"
                      >
                        {n.transactionHash.slice(0, 10)}...
                        {n.transactionHash.slice(-8)} <ExternalLink size={12} />
                      </a>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="p-4">
                    <StatusBadge status={n.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
