import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import LinkGenerator from "@/components/payment/LinkGenerator";
import LinkCard from "@/components/payment/LinkCard";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Shield, Link2, Lock, Key, EyeOff } from "lucide-react";

const FEATURES = [
  { icon: Zap, title: "Instant Links", desc: "Generate shareable payment URLs in seconds" },
  { icon: Shield, title: "Highly Secure", desc: " Your keys stay yours" },
  { icon: Link2, title: "Pre-filled Forms", desc: "Recipients see a ready-to-pay form" },

];

export default function Home() {
  const [createdLink, setCreatedLink] = useState(null);

  const handleLinkCreated = (link) => {
    setCreatedLink(link);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.08),transparent_60%)]" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 pb-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 mb-6">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="text-xs font-medium text-primary">Powered by Keeta Network</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
              Request Crypto Payments With 
              <span className="text-primary"> Ease</span>
            </h1>
            <p className="mt-4 text-muted-foreground max-w-lg mx-auto text-base sm:text-lg">
             Generate shareable crypto payment links with pre-filled recipient addresses for faster, cleaner Web3 payments
            </p>
          </motion.div>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-12 max-w-3xl mx-auto">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                className="flex items-center gap-2.5 p-3 rounded-xl border border-border bg-card/50 w-[230px] shrink-0"
              >
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <f.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-xs font-semibold text-foreground truncate">{f.title}</p>
                  <p className="text-[10px] text-muted-foreground leading-tight break-words">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Generator */}
          <div className="lg:col-span-2">
            <div className="sticky top-24">
              <div className="p-6 rounded-2xl border border-border bg-card">
                <h2 className="text-lg font-bold text-foreground mb-1">Create Payment Link</h2>
                <p className="text-xs text-muted-foreground mb-6">Fill in the details to generate a shareable link</p>
                <LinkGenerator onLinkCreated={handleLinkCreated} />
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3 space-y-6">
            <AnimatePresence>
              {createdLink && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <h3 className="text-sm font-semibold text-foreground mb-3">Latest Link</h3>
                  <LinkCard link={createdLink} />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="p-6 rounded-2xl border border-border bg-card/60 backdrop-blur-sm space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary" />
                  Privacy-First Settlement
                </h3>
                <p className="text-xs text-muted-foreground mt-1 font-normal leading-relaxed">
                  Keeta payment links are completely client-side, self-custodial, and protected by point-to-point Web3 cryptography. No intermediaries can track your transfers.
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-border/60">
                <div className="flex gap-3">
                  <div className="mt-0.5 shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <EyeOff className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-foreground">Zero Public Ledger Crawling</h4>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                      Generated URLs store parameters (address and amount) directly in the hash or query parameters. No user records or payment lists are ever stored on central servers.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="mt-0.5 shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <Key className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-foreground">On-Device Verification</h4>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                      Recipients and senders perform actions locally inside their own Web3 client. Transactions are signed directly on your device with complete security.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}