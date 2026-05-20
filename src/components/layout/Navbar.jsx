import React from "react";
import { Link } from "react-router-dom";
import { Layers } from "lucide-react";
import Logo from "@/components/layout/Logo";

export default function Navbar({ children }) {
  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center group hover:opacity-95 transition-opacity">
          <Logo className="h-8 w-8" showText={true} textClassName="text-[17px] ml-0.5" />
        </Link>
        <div className="flex items-center gap-3">
          <Link
            to="/bulk"
            className="text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/15 border border-primary/20 hover:border-primary/40 transition-all duration-200 px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-[0_0_10px_rgba(var(--primary),0.02)]"
          >
            <Layers className="h-3.5 w-3.5 text-primary" />
            Bulk Pay
          </Link>
          {children}
        </div>
      </div>
    </nav>);

}