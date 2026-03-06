import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { getContractById, createOrder } from "@/api";
import type { Contract } from "@/api";
import { CheckCircle, XCircle, Info } from "lucide-react";
import { toast } from "sonner";

export default function SubmitProposal() {
  const { contractId } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState<Contract | null>(null);
  const [form, setForm] = useState({
    productName: "",
    description: "",
    intendedUse: "",
    quantity: 100,
    estimatedUnitValue: 50,
    walletAddress: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a3c",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (contractId) getContractById(contractId).then(setContract);
  }, [contractId]);

  const update = (field: string, value: any) =>
    setForm((f) => ({ ...f, [field]: value }));
  const royaltyOwed = contract
    ? form.quantity * form.estimatedUnitValue * (contract.royaltyCut / 100)
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createOrder({ contractId, ...form });
      navigate("/manufacturer/proposals");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit proposal");
    } finally {
      setLoading(false);
    }
  };

  if (!contract)
    return (
      <DashboardLayout>
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-2">Submit Proposal</h1>
      <p className="text-muted-foreground text-sm mb-8">
        Propose your product for this IP license
      </p>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Contract summary */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-xl border border-border overflow-hidden shadow-card sticky top-24">
            <img
              src={contract.imageUrl}
              alt={contract.name}
              className="w-full h-40 object-cover"
            />
            <div className="p-5 space-y-4">
              <h2 className="font-semibold text-lg">{contract.name}</h2>
              <p className="text-sm text-muted-foreground">
                {contract.description}
              </p>
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground mb-1">
                  ALLOWED USES
                </h4>
                {contract.allowedUseCases.map((u, i) => (
                  <p key={i} className="text-sm flex items-center gap-1.5">
                    <CheckCircle size={12} className="text-success" />
                    {u}
                  </p>
                ))}
              </div>
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground mb-1">
                  RESTRICTIONS
                </h4>
                {contract.restrictions.map((r, i) => (
                  <p key={i} className="text-sm flex items-center gap-1.5">
                    <XCircle size={12} className="text-destructive" />
                    {r}
                  </p>
                ))}
              </div>
              <div className="pt-3 border-t border-border">
                <span className="text-sm text-muted-foreground">
                  Royalty Rate:
                </span>
                <span className="ml-2 font-bold text-accent">
                  {contract.royaltyCut}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
          <div className="bg-card rounded-xl border border-border p-6 shadow-card space-y-4">
            <h3 className="font-semibold">Product Details</h3>
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Product Name
              </label>
              <input
                value={form.productName}
                onChange={(e) => update("productName", e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Product Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                rows={3}
                className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Intended Use
              </label>
              <textarea
                value={form.intendedUse}
                onChange={(e) => update("intendedUse", e.target.value)}
                rows={2}
                className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
              />
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6 shadow-card space-y-4">
            <h3 className="font-semibold">Pricing & Quantity</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Quantity
                </label>
                <input
                  type="number"
                  value={form.quantity}
                  onChange={(e) => update("quantity", Number(e.target.value))}
                  min={1}
                  className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Estimated Unit Value ($)
                </label>
                <input
                  type="number"
                  value={form.estimatedUnitValue}
                  onChange={(e) =>
                    update("estimatedUnitValue", Number(e.target.value))
                  }
                  min={1}
                  className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>
            </div>
            <div className="bg-accent/5 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Royalty owed to IP owner:
              </p>
              <p className="text-2xl font-bold text-accent">
                ${royaltyOwed.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {form.quantity} × ${form.estimatedUnitValue} ×{" "}
                {contract.royaltyCut}%
              </p>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6 shadow-card space-y-4">
            <h3 className="font-semibold">Wallet Address</h3>
            <input
              value={form.walletAddress}
              onChange={(e) => update("walletAddress", e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Info size={12} /> Products will be minted as NFTs to this address
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl gradient-accent text-accent-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Proposal"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
