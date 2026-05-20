import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Wallet, LogOut, ExternalLink, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { connectWallet, isWalletInstalled, shortenAddress, subscribeToEvents } from "@/lib/keeta";
import { motion, AnimatePresence } from "framer-motion";

export default function WalletConnector({ onConnect, onDisconnect, compact = false, wallet = null }) {
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [installed, setInstalled] = useState(false);

  const connected = !!wallet?.address;
  const address = wallet?.address || null;
  const walletName = wallet?.walletName || null;

  useEffect(() => {
    setInstalled(isWalletInstalled());
  }, []);

  useEffect(() => {
    const unsub = subscribeToEvents({
      onAccountsChanged: (accounts) => {
        if (accounts && accounts.length > 0) {
          onConnect?.({ address: accounts[0] });
        } else {
          onDisconnect?.();
        }
      },
      onDisconnect: () => onDisconnect?.(),
    });
    return unsub;
  }, []);

  const handleConnect = async () => {
    setConnecting(true);
    setError(null);
    try {
      const result = await connectWallet();
      onConnect?.(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = () => {
    onDisconnect?.();
  };

  if (connected && address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2 border-primary/30 bg-primary/5 hover:bg-primary/10 text-foreground">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-sm">{shortenAddress(address)}</span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-3 py-2 border-b border-border">
            <p className="text-xs text-muted-foreground">Connected via</p>
            <p className="text-sm font-medium">{walletName || "Keeta Wallet"}</p>
          </div>
          <DropdownMenuItem onClick={handleDisconnect} className="text-destructive cursor-pointer">
            <LogOut className="h-4 w-4 mr-2" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (!installed) {
    return (
      <div className="space-y-2">
        <Button
          variant="outline"
          className="gap-2 border-border hover:border-primary/40"
          onClick={() => window.open("https://chromewebstore.google.com/detail/keythings-wallet/jhngbkboonmpephhenljbljnpffabloh", "_blank")}
        >
          <Wallet className="h-4 w-4" />
          Install Keythings Wallet
          <ExternalLink className="h-3 w-3" />
        </Button>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Button
        onClick={handleConnect}
        disabled={connecting}
        className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {connecting ? (
          <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
        ) : (
          <Wallet className="h-4 w-4" />
        )}
        {connecting ? "Connecting..." : "Connect Wallet"}
      </Button>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs text-destructive"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}