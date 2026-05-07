'use client';

import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#050816] text-white flex flex-col items-center justify-center p-6 text-center">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-card p-12 max-w-md space-y-8 border-rose-500/20"
      >
        <div className="flex justify-center">
          <div className="p-4 bg-rose-500/10 rounded-full">
            <AlertCircle className="w-12 h-12 text-rose-500" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-black italic uppercase italic tracking-tight">System Breach</h1>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">A critical error occurred while accessing the arena data.</p>
        </div>

        <div className="p-4 bg-black/40 border border-white/5 rounded font-mono text-[10px] text-rose-400 break-all">
          {error.message || "Unknown Platform Exception"}
        </div>

        <div className="flex flex-col gap-4">
          <button 
            onClick={() => reset()}
            className="esports-button flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Re-initialize System
          </button>
          <Link href="/" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors flex items-center justify-center gap-2">
            <Home className="w-4 h-4" /> Return to Command Center
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
