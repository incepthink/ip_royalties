import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Save } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    company: user?.company || "",
    walletAddress: user?.walletAddress || "",
    currentPassword: "",
    newPassword: "",
  });

  const update = (field: string, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground text-sm mb-8">
          Manage your account settings
        </p>

        <div className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Profile</h3>
              <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium capitalize">
                {user?.role}
              </span>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Full Name
                </label>
                <input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Company
              </label>
              <input
                value={form.company}
                onChange={(e) => update("company", e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
            </div>
            {user?.role === "manufacturer" && (
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Wallet Address
                </label>
                <input
                  value={form.walletAddress}
                  onChange={(e) => update("walletAddress", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>
            )}
          </div>

          <div className="bg-card rounded-xl border border-border p-6 shadow-card space-y-4">
            <h3 className="font-semibold">Change Password</h3>
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Current Password
              </label>
              <input
                type="password"
                value={form.currentPassword}
                onChange={(e) => update("currentPassword", e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                New Password
              </label>
              <input
                type="password"
                value={form.newPassword}
                onChange={(e) => update("newPassword", e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
            </div>
          </div>

          <button className="flex items-center justify-center gap-2 w-full py-3 rounded-xl gradient-accent text-accent-foreground font-semibold hover:opacity-90 transition-opacity">
            <Save size={16} /> Save Changes
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
