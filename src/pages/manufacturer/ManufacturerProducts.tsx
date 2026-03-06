import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import StatusBadge from "@/components/StatusBadge";
import { getManufacturerNFTs } from "@/api";
import type { NFT } from "@/api";
import { ExternalLink, Package } from "lucide-react";

export default function ManufacturerProducts() {
  const [nfts, setNfts] = useState<NFT[]>([]);
  useEffect(() => {
    getManufacturerNFTs("mfr1").then(setNfts);
  }, []);

  const contracts = [...new Set(nfts.map((n) => n.contractName))];

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-2">My Products</h1>
      <p className="text-muted-foreground text-sm mb-8">
        All your manufactured products tracked on-chain
      </p>

      <div className="bg-card rounded-xl border border-border p-6 shadow-card mb-8">
        <div className="grid grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-3xl font-bold text-accent">{nfts.length}</p>
            <p className="text-sm text-muted-foreground">Total Products</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{contracts.length}</p>
            <p className="text-sm text-muted-foreground">From Contracts</p>
          </div>
          <div>
            <p className="text-sm font-mono text-muted-foreground mt-2">
              0x1a2b...9f3c
            </p>
            <p className="text-sm text-muted-foreground">Wallet Address</p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Contract
                </th>
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
              {nfts.map((n, i) => (
                <tr
                  key={i}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="p-4 font-medium">{n.contractName}</td>
                  <td className="p-4 font-mono">{n.tokenId}</td>
                  <td className="p-4 text-muted-foreground">{n.mintedDate}</td>
                  <td className="p-4">
                    <span className="font-mono text-xs text-accent cursor-pointer hover:underline flex items-center gap-1">
                      {n.transactionHash.slice(0, 10)}...
                      {n.transactionHash.slice(-8)} <ExternalLink size={12} />
                    </span>
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
