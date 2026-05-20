import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, ExternalLink, Share2, ScanLine } from "lucide-react";
import { shortenAddress, getPayUrl } from "@/lib/keeta";
import { motion } from "framer-motion";
import { toast } from "sonner";
import QRCodeModal from "@/components/payment/QRCodeModal";

export default function LinkCard({ link }) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const payUrl = getPayUrl(link);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(payUrl);
    setCopied(true);
    toast.success("Link copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: link.label || "Keeta Payment",
        text: `Pay ${link.amount ? link.amount + " " + link.token : ""} to ${shortenAddress(link.recipient_address)}`,
        url: payUrl,
      });
    } else {
      handleCopy();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-card border-primary/20 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Payment Link</p>
              <p className="font-semibold text-foreground">{link.label || "Untitled Payment"}</p>
            </div>
            <Badge variant="outline" className="border-primary/30 text-primary text-xs">
              {link.network === "test" ? "Testnet" : "Mainnet"}
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            {link.amount && (
              <div className="text-2xl font-bold font-mono text-foreground">
                {link.amount} <span className="text-primary text-lg">{link.token}</span>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Recipient</p>
            <p className="font-mono text-xs text-secondary-foreground break-all">{link.recipient_address}</p>
          </div>

          {link.memo && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Memo</p>
              <p className="text-sm text-secondary-foreground">{link.memo}</p>
            </div>
          )}

          <div className="p-3 rounded-lg bg-secondary/50 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Shareable URL</p>
            <p className="font-mono text-xs text-foreground break-all">{payUrl}</p>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleCopy} variant="outline" className="flex-1 gap-2 border-border hover:border-primary/40">
              {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : "Copy Link"}
            </Button>
            <Button onClick={handleShare} variant="outline" className="flex-1 gap-2 border-border hover:border-primary/40">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="border-border hover:border-primary/40"
              onClick={() => setShowQR(true)}
              title="Show QR Code"
            >
              <ScanLine className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="border-border hover:border-primary/40"
              onClick={() => window.open(payUrl, "_blank")}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
      <QRCodeModal link={link} open={showQR} onClose={() => setShowQR(false)} />
    </motion.div>
  );
}