import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Shield, Package } from "lucide-react";
import { loginUser } from "@/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function Login() {
  const [role, setRole] = useState<"owner" | "manufacturer">("owner");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const loginAsDemo = (demoRole: "owner" | "manufacturer") => {
    const demoUsers = {
      owner: { id: "owner1", name: "Jordan Brand", email: "owner@demo.com", role: "owner" as const },
      manufacturer: { id: "mfr1", name: "Nike Corp", email: "mfr@demo.com", role: "manufacturer" as const, company: "Nike Corp", walletAddress: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a3c" },
    };
    login("mock-jwt-token", demoUsers[demoRole]);
    navigate(demoRole === "owner" ? "/owner/dashboard" : "/manufacturer/dashboard");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser({ email, password, role });
      login(res.token, res.user);
      navigate(
        res.user.role === "owner"
          ? "/owner/dashboard"
          : "/manufacturer/dashboard",
      );
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Link to="/" className="block text-center text-2xl font-bold mb-8">
          <span className="text-gradient">IP</span>Chain
        </Link>
        <div className="bg-card rounded-2xl border border-border p-8 shadow-card">
          <h1 className="text-2xl font-bold text-center mb-6">Welcome back</h1>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { value: "owner" as const, label: "IP Owner", icon: Shield, desc: "License your IP" },
              { value: "manufacturer" as const, label: "Manufacturer", icon: Package, desc: "Produce products" },
            ].map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRole(r.value)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${role === r.value ? "border-accent bg-accent/5" : "border-border hover:border-muted-foreground/30"}`}
              >
                <r.icon size={24} className={role === r.value ? "text-accent" : "text-muted-foreground"} />
                <p className="font-semibold mt-2 text-sm">{r.label}</p>
                <p className="text-xs text-muted-foreground">{r.desc}</p>
              </button>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@company.com"
                className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
            </div>
            <div className="relative">
              <label className="text-sm font-medium mb-1.5 block">
                Password
              </label>
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-9 text-muted-foreground"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg gradient-accent text-accent-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-accent font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-center text-xs text-muted-foreground mb-2">Try demo accounts</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => loginAsDemo("owner")}
                className="py-2 rounded-lg border border-border text-xs font-medium hover:bg-accent/5 hover:border-accent/50 transition-colors"
              >
                Demo Owner
              </button>
              <button
                type="button"
                onClick={() => loginAsDemo("manufacturer")}
                className="py-2 rounded-lg border border-border text-xs font-medium hover:bg-accent/5 hover:border-accent/50 transition-colors"
              >
                Demo Manufacturer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
