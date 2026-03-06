import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Upload } from "lucide-react";
import { createContract } from "@/api";
import { toast } from "sonner";

export default function CreateContract() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: "",
    allowedUseCases: "",
    restrictions: "",
    royaltyCut: 12,
    isPublished: true,
  });
  const [loading, setLoading] = useState(false);

  const update = (field: string, value: any) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (publish: boolean) => {
    setLoading(true);
    try {
      await createContract({ ...form, isPublished: publish } as any);
      navigate("/owner/contracts");
    } catch (err: any) {
      toast.error(err.message || "Failed to create contract");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Create New Contract</h1>
        <p className="text-muted-foreground text-sm mb-8">
          Define the terms of your IP license
        </p>

        <div className="space-y-8">
          {/* Section 1 */}
          <section className="bg-card rounded-xl border border-border p-6 shadow-card">
            <h2 className="font-semibold mb-4">Contract Details</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Contract Name
                </label>
                <input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                  placeholder="e.g. Air Logo License"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  IP Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
                  placeholder="Describe your intellectual property..."
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  IP Image
                </label>
                <div className="border-2 border-dashed border-input rounded-xl p-8 text-center hover:border-accent/50 transition-colors cursor-pointer">
                  <Upload
                    size={32}
                    className="mx-auto text-muted-foreground mb-2"
                  />
                  <p className="text-sm text-muted-foreground">
                    Drag & drop an image, or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG up to 10MB
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="bg-card rounded-xl border border-border p-6 shadow-card">
            <h2 className="font-semibold mb-4">Usage Terms</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Allowed Use Cases
                </label>
                <textarea
                  value={form.allowedUseCases}
                  onChange={(e) => update("allowedUseCases", e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
                  placeholder="e.g. Footwear production, Apparel manufacturing..."
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Restrictions
                </label>
                <textarea
                  value={form.restrictions}
                  onChange={(e) => update("restrictions", e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
                  placeholder="e.g. No modifications to logo proportions..."
                />
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="bg-card rounded-xl border border-border p-6 shadow-card">
            <h2 className="font-semibold mb-4">Royalty Terms</h2>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium">Royalty Cut</label>
                <span className="text-2xl font-bold text-accent">
                  {form.royaltyCut}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={50}
                value={form.royaltyCut}
                onChange={(e) => update("royaltyCut", Number(e.target.value))}
                className="w-full accent-accent"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0%</span>
                <span>50%</span>
              </div>
              <p className="text-sm text-muted-foreground mt-3 bg-accent/5 p-3 rounded-lg">
                You will receive{" "}
                <span className="font-semibold text-accent">
                  {form.royaltyCut}%
                </span>{" "}
                of the agreed product value for each unit manufactured.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="bg-card rounded-xl border border-border p-6 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Visibility</h3>
                <p className="text-sm text-muted-foreground">
                  Make this contract visible to manufacturers
                </p>
              </div>
              <button
                onClick={() => update("isPublished", !form.isPublished)}
                className={`relative w-12 h-6 rounded-full transition-colors ${form.isPublished ? "bg-accent" : "bg-muted"}`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-card shadow transition-transform ${form.isPublished ? "left-6" : "left-0.5"}`}
                />
              </button>
            </div>
          </section>

          <div className="flex gap-3">
            <button
              onClick={() => handleSubmit(false)}
              disabled={loading}
              className="flex-1 py-3 rounded-xl border border-border font-semibold text-sm hover:bg-muted transition-colors disabled:opacity-50"
            >
              Save as Draft
            </button>
            <button
              onClick={() => handleSubmit(true)}
              disabled={loading}
              className="flex-1 py-3 rounded-xl gradient-accent text-accent-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              Publish Contract
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
