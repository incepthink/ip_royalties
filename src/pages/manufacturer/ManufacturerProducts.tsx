import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import StatusBadge from "@/components/StatusBadge";
import { axiosManufacturer } from "@/lib/utils";

interface Product {
  contract_name: string;
  product_name: string;
  product_quantity: number;
  transaction_hash: string | null;
  contract_status: string;
}

interface Summary {
  total_products: number;
  total_contracts: number;
  total_royalty_owned: number;
}

export default function ManufacturerProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [summary, setSummary] = useState<Summary>({
    total_products: 0,
    total_contracts: 0,
    total_royalty_owned: 0,
  });

  useEffect(() => {
    axiosManufacturer.get("/user/ip-proposal/products").then((res) => {
      setProducts(res.data.data.product_description);
      setSummary(res.data.data.summary);
    });
  }, []);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-2">My Products</h1>
      <p className="text-muted-foreground text-sm mb-8">
        All your manufactured products tracked on-chain
      </p>

      <div className="bg-card rounded-xl border border-border p-6 shadow-card mb-8">
        <div className="grid grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-3xl font-bold text-accent">
              {summary.total_products}
            </p>
            <p className="text-sm text-muted-foreground">Total Products</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{summary.total_contracts}</p>
            <p className="text-sm text-muted-foreground">Total Contracts</p>
          </div>
          <div>
            <p className="text-3xl font-bold">${summary.total_royalty_owned}</p>
            <p className="text-sm text-muted-foreground">Total Royalty Owed</p>
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
                  Product
                </th>
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Quantity
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
              {products.map((p, i) => (
                <tr
                  key={i}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="p-4 font-medium">{p.contract_name}</td>
                  <td className="p-4">{p.product_name}</td>
                  <td className="p-4">{p.product_quantity}</td>
                  <td className="p-4 font-mono text-xs text-accent">
                    {p.transaction_hash
                      ? `${p.transaction_hash.slice(0, 10)}...${p.transaction_hash.slice(-8)}`
                      : "—"}
                  </td>
                  <td className="p-4">
                    <StatusBadge status={p.contract_status} />
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
