import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import StatusBadge from "@/components/StatusBadge";
import { Search } from "lucide-react";
import { getAvailableContracts } from "@/api";
import type { Contract } from "@/api";

export default function BrowseLicenses() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    getAvailableContracts().then(setContracts);
  }, []);

  const categories = ["All", "Art", "Fashion", "Sports", "Tech"];
  const filtered = contracts.filter(
    (c) =>
      (category === "All" || c.category === category) &&
      (c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.ownerName.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-2">Browse Licenses</h1>
      <p className="text-muted-foreground text-sm mb-6">
        Find IP licenses for your manufacturing needs
      </p>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search licenses..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </div>
        <div className="flex gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${category === c ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((c) => (
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
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-semibold">{c.name}</h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                  {c.royaltyCut}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                by {c.ownerName}
              </p>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {c.description}
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Uses: {c.allowedUseCases.slice(0, 2).join(", ")}
              </p>
              <Link
                to={`/manufacturer/propose/${c.id}`}
                className="block text-center py-2.5 rounded-lg gradient-accent text-accent-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                View & Propose
              </Link>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
