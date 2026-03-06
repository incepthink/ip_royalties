import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shield,
  ArrowRight,
  CheckCircle,
  BarChart3,
  Zap,
  FileCheck,
  Eye,
  DollarSign,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-6">
          <span className="text-xl font-bold tracking-tight">
            <span className="text-gradient">IP</span>Chain
          </span>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="text-sm font-medium px-4 py-2 rounded-lg gradient-accent text-accent-foreground hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
            <Zap size={14} /> Now in Public Beta
          </span>
        </motion.div>
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={1}
          className="text-5xl md:text-6xl font-extrabold tracking-tight text-foreground max-w-3xl mx-auto leading-[1.1]"
        >
          License Your IP.{" "}
          <span className="text-gradient">Track Every Product.</span>
        </motion.h1>
        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={2}
          className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto"
        >
          The modern platform connecting intellectual property owners with
          manufacturers. Transparent contracts, on-chain tracking, and automated
          royalties.
        </motion.p>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={3}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/signup?role=owner"
            className="flex items-center gap-2 px-6 py-3 rounded-xl gradient-accent text-accent-foreground font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-accent/25"
          >
            <Shield size={18} /> I'm an IP Owner <ArrowRight size={16} />
          </Link>
          <Link
            to="/signup?role=manufacturer"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-card border border-border text-foreground font-semibold hover:bg-muted transition-colors"
          >
            I'm a Manufacturer <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>

      {/* How it works */}
      <section className="bg-card border-y border-border py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-muted-foreground text-center mb-14 max-w-lg mx-auto">
            Three simple steps from license creation to product tracking
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create a License",
                desc: "IP owners define terms, royalties, and usage rights for their intellectual property.",
                icon: FileCheck,
              },
              {
                step: "02",
                title: "Manufacturer Proposes",
                desc: "Manufacturers browse licenses, submit proposals with product details and quantities.",
                icon: Eye,
              },
              {
                step: "03",
                title: "Products Tracked On-Chain",
                desc: "Accepted products are minted as NFTs — every unit verifiable and royalties automated.",
                icon: BarChart3,
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="relative p-6 rounded-2xl bg-background border border-border hover:shadow-card-hover transition-shadow"
              >
                <span className="text-6xl font-black text-accent/10 absolute top-4 right-6">
                  {item.step}
                </span>
                <div className="w-10 h-10 rounded-lg gradient-accent flex items-center justify-center mb-4">
                  <item.icon size={20} className="text-accent-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-14">
          Built for Trust & Transparency
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: FileCheck,
              title: "Transparent Contracts",
              desc: "Every license agreement is clear, structured, and accessible to both parties.",
            },
            {
              icon: BarChart3,
              title: "On-Chain Tracking",
              desc: "Each product unit is minted as a unique token — fully traceable from factory to shelf.",
            },
            {
              icon: DollarSign,
              title: "Automated Royalties",
              desc: "Royalty calculations happen automatically based on agreed terms. No manual invoicing.",
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              className="p-6 rounded-2xl bg-card border border-border text-center hover:shadow-card-hover transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <f.icon size={24} className="text-accent" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-card border-y border-border py-14">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-3 gap-8 text-center">
          {[
            { value: "142", label: "Active Licenses" },
            { value: "3,800+", label: "Products Tracked" },
            { value: "$2.4M", label: "In Royalties Managed" },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
            >
              <p className="text-3xl md:text-4xl font-extrabold text-gradient">
                {s.value}
              </p>
              <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-lg font-bold">
            <span className="text-gradient">IP</span>Chain
          </span>
          <p className="text-sm text-muted-foreground">
            © 2024 IPChain. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
