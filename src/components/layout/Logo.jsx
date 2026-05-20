import React from "react";
import { Wallet } from "lucide-react";

export default function Logo({ className = "h-8 w-8", showText = false, textClassName = "" }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Scalable Vector Logo Design recreating the uploaded asset with exact neon cyan/green color scheme */}
      <svg
        viewBox="0 0 160 160"
        className="h-full w-auto select-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="logoCyanGreenGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00E5FF" />
            <stop offset="60%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
          <linearGradient id="linkCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00E5FF" />
            <stop offset="100%" stopColor="#0891b2" />
          </linearGradient>
        </defs>

        {/* Small scattered QR-matrix pixels / blockchain data points on top-right */}
        <g opacity="0.9">
          <rect x="85" y="35" width="4" height="4" fill="#00E5FF" />
          <rect x="92" y="35" width="4" height="4" fill="#10B981" />
          <rect x="85" y="42" width="4" height="4" fill="#10B981" />
          
          <rect x="115" y="55" width="4" height="4" fill="#00E5FF" />
          <rect x="122" y="55" width="4" height="4" fill="#00E5FF" />
          <rect x="119" y="62" width="4" height="4" fill="#10B981" />
          
          <rect x="105" y="70" width="5" height="5" fill="#00E5FF" />
          <rect x="112" y="72" width="4" height="4" fill="#10B981" />
          <rect x="108" y="78" width="4" height="4" fill="#00E5FF" />

          <rect x="13" y="105" width="4" height="4" fill="#00E5FF" />
          <rect x="20" y="109" width="4" height="4" fill="#0891b2" />
          <rect x="25" y="115" width="4" height="4" fill="#00E5FF" />
        </g>

        {/* Top-Right Green Chain Link */}
        <path
          d="M 125,50 
             C 142,67 132,95 110,105 
             L 85,80 
             C 95,70 108,67 115,58
             L 98,42 
             C 107,33 117,42 125,50 Z"
          fill="url(#logoCyanGreenGrad)"
        />
        <path
          d="M 98,42 
             L 78,62 
             C 74,58 78,50 85,42 
             C 92,34 98,38 98,42 Z"
          fill="url(#logoCyanGreenGrad)"
          opacity="0.95"
        />

        {/* Bottom-Left Cyan Chain Link */}
        <path
          d="M 35,110 
             C 18,93 28,65 50,55 
             L 75,80 
             C 65,90 52,93 45,102 
             L 62,118 
             C 53,127 43,118 35,110 Z"
          fill="url(#linkCyanGrad)"
        />

        {/* Diagonal connector inner band */}
        <path
          d="M 68,92 L 60,84 L 84,60 L 92,68 Z"
          fill="url(#logoCyanGreenGrad)"
        />

        {/* Center alignment ring-in-circle (QR target design) inside bottom-left link */}
        <circle cx="50" cy="110" r="14" fill="#0891b2" />
        <circle cx="50" cy="110" r="10" fill="#ffffff" />
        <circle cx="50" cy="110" r="6" fill="#00E5FF" />

        {/* Scattered QR patterns integrated directly into the bottom-left curve */}
        <rect x="42" y="78" width="5" height="5" fill="#00E5FF" />
        <rect x="35" y="85" width="5" height="5" fill="#0891b2" />
        <rect x="28" y="92" width="5" height="5" fill="#00E5FF" />
        <rect x="52" y="88" width="4" height="4" fill="#00E5FF" />

        {/* Decorative corner pixels to represent QR alignment structure */}
        <path d="M 130,100 L 140,100 L 140,110" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
        <path d="M 110,130 L 120,130 L 120,120" stroke="#00E5FF" strokeWidth="2" strokeLinecap="round" />
        <path d="M 30,30 L 20,30 L 20,40" stroke="#00E5FF" strokeWidth="2" strokeLinecap="round" />
      </svg>
      {showText && (
        <span className={`font-bold select-none tracking-tight flex items-center gap-1.5 ${textClassName}`}>
          <Wallet className="h-4 w-4 text-[#10B981] shrink-0 opacity-90 transition-transform group-hover:scale-110 duration-200" />
          <span className="text-[#ffffff]">
            Keeta<span className="text-[#10B981]">Pay</span>
          </span>
        </span>
      )}
    </div>
  );
}
