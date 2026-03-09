import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Upload } from "lucide-react";
import { createContract } from "@/api";
import { IpContractCategory } from "@/types/contract";
import { toast } from "sonner";
import { uploadImage } from "@/lib/utils";

const CATEGORIES = Object.values(IpContractCategory);

const splitToArray = (value: string): string[] =>
  value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

export default function CreateContract() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: "",
    image_url: "",
    category: "" as IpContractCategory | "",
    allowedUseCases: "",
    restrictions: "",
    royaltyCut: 12,
  });
  const [loading, setLoading] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const coverRef = useRef<HTMLInputElement>(null);

  const update = (field: string, value: any) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast.error("Contract name is required");
      return;
    }
    if (!form.category) {
      toast.error("Please select a category");
      return;
    }
    setLoading(true);
    try {
      const image_url = coverFile
        ? await uploadImage(coverFile)
        : form.image_url || undefined;

      await createContract({
        name: form.name,
        royalty_cut: form.royaltyCut,
        category: form.category,
        description: form.description || undefined,
        image_url,
        allowed_use_cases: splitToArray(form.allowedUseCases),
        restrictions: splitToArray(form.restrictions),
      });
      navigate("/owner/contracts");
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "Failed to create contract");
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
          {/* Section 1: Contract Details */}
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
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => update("category", cat)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                        form.category === cat
                          ? "bg-accent text-accent-foreground border-accent"
                          : "border-input bg-background text-muted-foreground hover:border-accent/50 hover:text-foreground"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
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
                <input
                  ref={coverRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setCoverFile(file);
                    const reader = new FileReader();
                    reader.onload = () => setCoverPreview(reader.result as string);
                    reader.readAsDataURL(file);
                  }}
                />
                <button
                  type="button"
                  onClick={() => coverRef.current?.click()}
                  className="w-full border-2 border-dashed border-input rounded-xl overflow-hidden hover:border-accent/50 transition-colors"
                >
                  {coverPreview ? (
                    <img
                      src={coverPreview}
                      alt="Cover preview"
                      className="w-full object-cover max-h-64"
                    />
                  ) : (
                    <div className="p-8 text-center">
                      <Upload size={32} className="mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Drag & drop an image, or click to browse
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG up to 10MB
                      </p>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </section>

          {/* Section 2: Usage Terms */}
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
                <p className="text-xs text-muted-foreground mt-1">
                  Separate multiple values with commas
                </p>
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
                <p className="text-xs text-muted-foreground mt-1">
                  Separate multiple values with commas
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Royalty Terms */}
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

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 rounded-xl gradient-accent text-accent-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Contract"}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
