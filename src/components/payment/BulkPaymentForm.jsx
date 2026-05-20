import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Upload, Eye, EyeOff, Play, Loader2, CheckCircle2,
  AlertCircle, ExternalLink, Trash2, Plus, Download
} from "lucide-react";
import { sendPayment, getAddressFromSeed, isValidKeetaAddress, shortenAddress } from "@/lib/keeta";
import { motion, AnimatePresence } from "framer-motion";

const EXPLORER_BASE = "https://explorer.test.keeta.com/block/";

const TEMPLATE_CSV = `address,amount\nkeeta_RECIPIENT1,10\nkeeta_RECIPIENT2,25`;

function parseCsv(text) {
  const lines = text.trim().split("\n").map(l => l.trim()).filter(Boolean);
  const rows = [];
  // skip header if present
  const start = lines[0].toLowerCase().includes("address") ? 1 : 0;
  for (let i = start; i < lines.length; i++) {
    const [address, amount] = lines[i].split(",").map(s => s.trim());
    rows.push({ address: address || "", amount: amount || "", status: "pending", hash: null, error: null });
  }
  return rows;
}

export default function BulkPaymentForm() {
  const [rows, setRows] = useState([{ address: "", amount: "", status: "pending", hash: null, error: null }]);
  const [seed, setSeed] = useState("");
  const [showSeed, setShowSeed] = useState(false);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const fileRef = useRef();

  let senderAddress = null;
  if (seed.trim().length > 10) {
    try { senderAddress = getAddressFromSeed(seed); } catch (_) {}
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const parsed = parseCsv(ev.target.result);
      if (parsed.length) setRows(parsed);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const updateRow = (i, field, value) => {
    setRows(prev => prev.map((r, idx) => idx === i ? { ...r, [field]: value } : r));
  };

  const addRow = () => setRows(prev => [...prev, { address: "", amount: "", status: "pending", hash: null, error: null }]);

  const removeRow = (i) => setRows(prev => prev.filter((_, idx) => idx !== i));

  const reset = () => {
    setRows(rows.map(r => ({ ...r, status: "pending", hash: null, error: null })));
    setDone(false);
  };

  const handleRun = async () => {
    setRunning(true);
    setDone(false);
    // reset statuses
    setRows(prev => prev.map(r => ({ ...r, status: "pending", hash: null, error: null })));

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (!isValidKeetaAddress(row.address) || !row.amount || isNaN(Number(row.amount)) || Number(row.amount) <= 0) {
        setRows(prev => prev.map((r, idx) => idx === i ? { ...r, status: "failed", error: "Invalid address or amount" } : r));
        continue;
      }
      if (row.address === senderAddress) {
        setRows(prev => prev.map((r, idx) => idx === i ? { ...r, status: "failed", error: "Cannot send to yourself" } : r));
        continue;
      }
      setRows(prev => prev.map((r, idx) => idx === i ? { ...r, status: "sending" } : r));
      try {
        const result = await sendPayment({ seed, to: row.address, amount: row.amount, network: "test" });
        
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

        setRows(prev => prev.map((r, idx) => idx === i ? { ...r, status: "success", hash } : r));
      } catch (err) {
        setRows(prev => prev.map((r, idx) => idx === i ? { ...r, status: "failed", error: err.message || "Failed" } : r));
      }
    }

    setRunning(false);
    setDone(true);
  };

  const downloadTemplate = () => {
    const blob = new Blob([TEMPLATE_CSV], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "bulk_payments.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const successCount = rows.filter(r => r.status === "success").length;
  const failCount = rows.filter(r => r.status === "failed").length;
  const validRows = rows.filter(r => isValidKeetaAddress(r.address) && r.amount && !isNaN(Number(r.amount)) && Number(r.amount) > 0 && r.address !== senderAddress);
  const canRun = !running && seed.trim().length > 10 && validRows.length > 0;

  const statusConfig = {
    pending: null,
    sending: { color: "text-primary", icon: <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" /> },
    success: { color: "text-green-400", icon: <CheckCircle2 className="h-3.5 w-3.5 text-green-400" /> },
    failed: { color: "text-destructive", icon: <AlertCircle className="h-3.5 w-3.5 text-destructive" /> },
  };

  return (
    <div className="space-y-6">
      {/* Seed */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">Your Account Seed</Label>
        <div className="relative">
          <Input
            type={showSeed ? "text" : "password"}
            placeholder="Enter your Keeta account seed to sign all transactions…"
            value={seed}
            onChange={e => setSeed(e.target.value)}
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
          <p className="text-[11px] text-primary font-mono truncate">Sender: {shortenAddress(senderAddress)}</p>
        )}
      </div>

      {/* CSV upload + template */}
      <div className="flex items-center gap-2">
        <input ref={fileRef} type="file" accept=".csv,.txt" className="hidden" onChange={handleFileUpload} />
        <Button variant="outline" size="sm" onClick={() => fileRef.current.click()} className="gap-1.5">
          <Upload className="h-3.5 w-3.5" /> Upload CSV
        </Button>
        <Button variant="ghost" size="sm" onClick={downloadTemplate} className="gap-1.5 text-muted-foreground">
          <Download className="h-3.5 w-3.5" /> Download Template
        </Button>
        <span className="text-[11px] text-muted-foreground ml-auto">{rows.length} recipient{rows.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Table header */}
      <div className="grid grid-cols-[1fr_100px_28px_28px] gap-2 px-1">
        <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Recipient Address</span>
        <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Amount (KTA)</span>
        <span />
        <span />
      </div>

      {/* Rows */}
      <div className="space-y-2">
        <AnimatePresence>
          {rows.map((row, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-[1fr_100px_28px_28px] gap-2 items-center"
            >
              <div className="relative">
                <Input
                  value={row.address}
                  onChange={e => updateRow(i, "address", e.target.value)}
                  placeholder="keeta_…"
                  disabled={running}
                  className="font-mono text-xs h-9 bg-secondary/50 border-border focus:border-primary pr-7"
                />
                {statusConfig[row.status] && (
                  <span className="absolute right-2 top-1/2 -translate-y-1/2">
                    {statusConfig[row.status].icon}
                  </span>
                )}
              </div>
              <Input
                value={row.amount}
                onChange={e => updateRow(i, "amount", e.target.value)}
                placeholder="0"
                disabled={running}
                className="font-mono text-xs h-9 bg-secondary/50 border-border focus:border-primary"
                inputMode="decimal"
              />
              {/* Explorer link or spacer */}
              {row.status === "success" ? (
                <a
                  href={row.hash ? `${EXPLORER_BASE}${row.hash}` : `https://explorer.test.keeta.com/account/${row.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center h-7 w-7 rounded text-primary hover:bg-primary/10 transition-colors"
                  title={row.hash ? "View Transaction on Explorer" : "View Recipient on Explorer"}
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ) : (
                <span />
              )}
              <button
                onClick={() => removeRow(i)}
                disabled={running || rows.length === 1}
                className="flex items-center justify-center h-7 w-7 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 disabled:opacity-30 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
              {/* Error message */}
              {row.error && (
                <p className="col-span-4 text-[11px] text-destructive pl-1 -mt-1">{row.error}</p>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Button variant="ghost" size="sm" onClick={addRow} disabled={running} className="gap-1.5 text-muted-foreground">
        <Plus className="h-3.5 w-3.5" /> Add Row
      </Button>

      {/* Summary bar */}
      {done && (
        <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-secondary/30 text-sm">
          <span className="text-green-400 font-medium">{successCount} sent</span>
          {failCount > 0 && <span className="text-destructive font-medium">{failCount} failed</span>}
          <Button variant="ghost" size="sm" onClick={reset} className="ml-auto text-muted-foreground h-7">
            Retry / Reset
          </Button>
        </div>
      )}

      {/* Transaction Receipts Panel */}
      {rows.some(r => r.status === "success") && (
        <div className="space-y-2.5 p-4 rounded-xl border border-border/80 bg-background/50 backdrop-blur-sm">
          <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <ExternalLink className="h-3.5 w-3.5 text-primary" />
            Transaction Receipts (Testnet Explorer)
          </h4>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {rows.filter(r => r.status === "success").map((row, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded-lg border border-border/40 bg-card hover:bg-secondary/20 transition-all duration-200 text-[11px] font-mono">
                <div className="flex items-center gap-2 truncate">
                  <span className="text-primary font-semibold shrink-0">+{row.amount} KTA</span>
                  <span className="text-muted-foreground shrink-0">to</span>
                  <span className="text-foreground truncate" title={row.address}>
                    {shortenAddress(row.address)}
                  </span>
                </div>
                <a
                  href={row.hash ? `${EXPLORER_BASE}${row.hash}` : `https://explorer.test.keeta.com/account/${row.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary hover:text-primary-foreground hover:bg-primary border border-primary/20 hover:border-primary transition-all duration-150 px-2.5 py-1 rounded shadow-sm"
                  title={row.hash ? "View Transaction on Testnet Explorer" : "View Recipient on Explorer"}
                >
                  <span className="text-[10px] font-semibold">
                    {row.hash ? `Tx: ${row.hash.slice(0, 8)}…${row.hash.slice(-6)}` : "View Account"}
                  </span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Run button */}
      <Button
        onClick={handleRun}
        disabled={!canRun}
        className="w-full h-12 text-base font-semibold gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {running ? (
          <><Loader2 className="h-5 w-5 animate-spin" /> Sending payments…</>
        ) : (
          <><Play className="h-5 w-5" /> Send {validRows.length} Payment{validRows.length !== 1 ? "s" : ""}</>
        )}
      </Button>

      <p className="text-[11px] text-muted-foreground text-center">
        Payments are sent one-by-one sequentially. Your seed never leaves your browser.
      </p>
    </div>
  );
}