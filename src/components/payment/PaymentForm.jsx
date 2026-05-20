import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Loader2, CheckCircle2, AlertCircle, Eye, EyeOff, ExternalLink } from "lucide-react";
import { shortenAddress, sendPayment, getAddressFromSeed } from "@/lib/keeta";
import RecentTransactions from "@/components/payment/RecentTransactions";
import { motion, AnimatePresence } from "framer-motion";

const EXPLORER_BASE = "https://explorer.test.keeta.com/block/";

export default function PaymentForm({ paymentLink }) {
  const [amount, setAmount] = useState(paymentLink?.amount || "");
  const [seed, setSeed] = useState("");
  const [showSeed, setShowSeed] = useState(false);
  const [sending, setSending] = useState(false);
  const [txResult, setTxResult] = useState(null);
  const [txError, setTxError] = useState(null);
  const [transactions, setTransactions] = useState([]);

  // Derive sender address from seed for display
  let senderAddress = null;
  if (seed.trim().length > 10) {
    try {
      senderAddress = getAddressFromSeed(seed);
    } catch (_) {}
  }

  const network = paymentLink?.network === "mainnet" ? "mainnet" : "test";

  const isSelfPayment = senderAddress && senderAddress === paymentLink?.recipient_address;

  const handleSend = async () => {
    if (isSelfPayment) return;
    setSending(true);
    setTxError(null);
    setTxResult(null);

    try {
      const result = await sendPayment({
        seed,
        to: paymentLink.recipient_address,
        amount,
        network,
      });

      // Extract a hash from the result for explorer linking
      let hash = null;
      const blocks = result?.blocks || result?.publishedBlocks || result?.voteStaple?.blocks || [];
      if (blocks && blocks.length > 0) {
        const firstBlock = blocks[0];
        if (firstBlock) {
          if (firstBlock.hash) {
            hash = typeof firstBlock.hash.toString === "function" ? firstBlock.hash.toString("hex") : String(firstBlock.hash);
          } else if (firstBlock.id) {
            hash = typeof firstBlock.id.toString === "function" ? firstBlock.id.toString("hex") : String(firstBlock.id);
          }
        }
      }
      if (!hash && result?.hash) {
        hash = typeof result.hash.toString === "function" ? result.hash.toString("hex") : String(result.hash);
      }

      setTxResult({ result, hash });
      setTransactions(prev => [
        {
          to: paymentLink.recipient_address,
          amount,
          token: paymentLink.token || "KTA",
          status: "success",
          hash,
          ts: Date.now(),
        },
        ...prev,
      ].slice(0, 5));
    } catch (err) {
      setTxError(err.message || "Transaction failed");
      setTransactions(prev => [
        {
          to: paymentLink.recipient_address,
          amount,
          token: paymentLink.token || "KTA",
          status: "failed",
          hash: null,
          ts: Date.now(),
        },
        ...prev,
      ].slice(0, 5));
    } finally {
      setSending(false);
    }
  };

  if (txResult) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6 py-8"
      >
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">Payment Sent</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {amount} {paymentLink.token || "KTA"} sent to {shortenAddress(paymentLink.recipient_address)}
          </p>
        </div>
        <a
          href={txResult.hash ? `${EXPLORER_BASE}${txResult.hash}` : `https://explorer.test.keeta.com/account/${paymentLink.recipient_address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
        >
          View on Explorer <ExternalLink className="h-3.5 w-3.5" />
        </a>
        <Button variant="outline" onClick={() => setTxResult(null)} className="mt-2">
          Send Another
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Recipient info */}
      <div className="p-4 rounded-xl bg-secondary/30 border border-border space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Paying to</span>
          <Badge variant="outline" className="border-primary/30 text-primary text-xs">
            {network === "mainnet" ? "Mainnet" : "Testnet"}
          </Badge>
        </div>
        <p className="font-mono text-sm text-foreground break-all">{paymentLink.recipient_address}</p>
        {paymentLink.memo && (
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground">Memo</p>
            <p className="text-sm text-secondary-foreground">{paymentLink.memo}</p>
          </div>
        )}
      </div>

      {/* Amount */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Amount</Label>
        <div className="relative">
          <Input
            type="text"
            inputMode="decimal"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={!!paymentLink.amount}
            className="font-mono text-lg h-14 pr-16 bg-secondary/50 border-border focus:border-primary"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Badge className="bg-primary/10 text-primary border-0 font-mono">
              {paymentLink.token || "KTA"}
            </Badge>
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground">Amounts are whole numbers (1 = 1 KTA)</p>
      </div>

      {/* Seed input */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Your Account Seed</Label>
        <div className="relative">
          <Input
            type={showSeed ? "text" : "password"}
            placeholder="Enter your Keeta account seed to sign…"
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
            className="font-mono text-xs h-11 pr-10 bg-secondary/50 border-border focus:border-primary"
          />
          <button
            type="button"
            onClick={() => setShowSeed(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showSeed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {senderAddress && (
          <p className="text-[11px] text-primary font-mono truncate">
            Sender: {shortenAddress(senderAddress)}
          </p>
        )}
        <p className="text-[11px] text-muted-foreground">
          Your seed never leaves your browser. Get testnet tokens at{" "}
          <a href="https://faucet.test.keeta.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            faucet.test.keeta.com
          </a>
        </p>
      </div>

      {/* Self-payment warning */}
      <AnimatePresence>
        {isSelfPayment && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20"
          >
            <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">You cannot send a payment to yourself.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Send button */}
      <Button
        onClick={handleSend}
        disabled={sending || !seed.trim() || !amount || isNaN(Number(amount)) || Number(amount) <= 0 || isSelfPayment}
        className="w-full h-14 text-base font-semibold gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {sending ? (
          <><Loader2 className="h-5 w-5 animate-spin" /> Sending…</>
        ) : (
          <><ArrowUpRight className="h-5 w-5" /> Send {amount && !isNaN(Number(amount)) ? `${amount} ${paymentLink.token || "KTA"}` : "Payment"}</>
        )}
      </Button>

      {/* Error */}
      <AnimatePresence>
        {txError && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20"
          >
            <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{txError}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recent transactions */}
      {transactions.length > 0 && (
        <div className="pt-2 border-t border-border">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Recent Transactions</p>
          <RecentTransactions transactions={transactions} />
        </div>
      )}
    </div>
  );
}