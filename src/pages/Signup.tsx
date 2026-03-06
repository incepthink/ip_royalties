import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Shield, Package, Eye, EyeOff } from "lucide-react";
import { signupUser } from "@/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function Signup() {
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState<"owner" | "manufacturer">(
    searchParams.get("role") === "manufacturer" ? "manufacturer" : "owner",
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) return;
    setLoading(true);
    try {
      const res = await signupUser({ name, email, password, role });
      login(res.token, res.user);
      navigate(role === "owner" ? "/owner/dashboard" : "/manufacturer/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link to="/" className="block text-center text-2xl font-bold mb-8">
          <span className="text-gradient">IP</span>Chain
        </Link>
        <div className="bg-card rounded-2xl border border-border p-8 shadow-card">
          <h1 className="text-2xl font-bold text-center mb-6">
            Create your account
          </h1>
          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              {
                value: "owner" as const,
                label: "IP Owner",
                icon: Shield,
                desc: "License your IP",
              },
              {
                value: "manufacturer" as const,
                label: "Manufacturer",
                icon: Package,
                desc: "Produce products",
              },
            ].map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRole(r.value)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${role === r.value ? "border-accent bg-accent/5" : "border-border hover:border-muted-foreground/30"}`}
              >
                <r.icon
                  size={24}
                  className={
                    role === r.value ? "text-accent" : "text-muted-foreground"
                  }
                />
                <p className="font-semibold mt-2 text-sm">{r.label}</p>
                <p className="text-xs text-muted-foreground">{r.desc}</p>
              </button>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Full Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
              {password && confirm && password !== confirm && (
                <p className="text-xs text-destructive mt-1">
                  Passwords don't match
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg gradient-accent text-accent-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-accent font-medium hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
