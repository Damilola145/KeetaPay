import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import Navbar from "@/components/layout/Navbar";
import PaymentForm from "@/components/payment/PaymentForm";
import { Loader2, AlertCircle, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function Pay() {
  const [paymentLink, setPaymentLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const loadLink = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const linkId = urlParams.get("id");

      // Also support direct params: ?to=keeta_...&amount=10&token=KTA&memo=...
      const directTo = urlParams.get("to");

      if (linkId) {
        const results = await base44.entities.PaymentLink.filter({ link_id: linkId });
        if (results && results.length > 0) {
          setPaymentLink(results[0]);
        } else if (directTo) {
          // Fallback to direct URL parameters (keeps links fully self-contained across partitioned contexts)
          setPaymentLink({
            recipient_address: directTo,
            amount: urlParams.get("amount") || "",
            token: urlParams.get("token") || "KTA",
            memo: urlParams.get("memo") || "",
            label: urlParams.get("label") || "",
            network: urlParams.get("network") || "mainnet",
          });
        } else {
          setError("Payment link not found or has expired.");
        }
      } else if (directTo) {
        // Build an ad-hoc payment link from URL params
        setPaymentLink({
          recipient_address: directTo,
          amount: urlParams.get("amount") || "",
          token: urlParams.get("token") || "KTA",
          memo: urlParams.get("memo") || "",
          label: urlParams.get("label") || "",
          network: urlParams.get("network") || "mainnet",
        });
      } else {
        setError("No payment information provided. Please use a valid payment link.");
      }

      setLoading(false);
    };

    loadLink();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.06),transparent_50%)]" />

        <div className="max-w-md mx-auto px-4 sm:px-6 pt-12 pb-20 relative">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground mt-3">Loading payment details...</p>
            </div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="mx-auto w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                <AlertCircle className="h-7 w-7 text-destructive" />
              </div>
              <h2 className="text-lg font-bold text-foreground">Link Not Found</h2>
              <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">{error}</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 mb-4">
                  <Zap className="h-3 w-3 text-primary" />
                  <span className="text-xs font-medium text-primary">Keeta Network Payment</span>
                </div>
                <h1 className="text-2xl font-bold text-foreground">
                  {paymentLink.label || "Send Payment"}
                </h1>
                {paymentLink.amount && (
                  <p className="text-3xl font-bold font-mono text-foreground mt-2">
                    {paymentLink.amount} <span className="text-primary text-xl">{paymentLink.token || "KTA"}</span>
                  </p>
                )}
              </div>

              <div className="p-6 rounded-2xl border border-border bg-card">
              <PaymentForm paymentLink={paymentLink} />
              </div>

              <p className="text-center text-[10px] text-muted-foreground/60 mt-6">
                Transactions are signed locally by your wallet. No private keys are shared with this site.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}