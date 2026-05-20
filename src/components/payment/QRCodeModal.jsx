import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { getPayUrl } from "@/lib/keeta";

export default function QRCodeModal({ link, open, onClose }) {
  const payUrl = getPayUrl(link);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(payUrl);
    toast.success("Link copied!");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xs text-center">
        <DialogHeader>
          <DialogTitle className="text-foreground">{link?.label || "Scan to Pay"}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-2">
          <div className="p-4 rounded-xl bg-white">
            <QRCodeSVG
              value={payUrl}
              size={180}
              bgColor="#ffffff"
              fgColor="#0f1117"
              level="M"
            />
          </div>
          <p className="text-xs text-muted-foreground">Scan with your mobile wallet to pay</p>
          {link?.amount && (
            <p className="text-lg font-bold font-mono text-foreground">
              {link.amount} <span className="text-primary">{link.token || "KTA"}</span>
            </p>
          )}
          <div className="flex gap-2 w-full">
            <Button onClick={handleCopy} variant="outline" className="flex-1 gap-2 text-xs">
              <Copy className="h-3.5 w-3.5" />
              Copy Link
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => window.open(payUrl, "_blank")}
              className="border-border"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}