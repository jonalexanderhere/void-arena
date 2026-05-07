'use client';

import { motion } from 'framer-motion';
import { Search, Home, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050816] text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8 z-10"
      >
        <div className="relative">
          <h1 className="text-[150px] font-black italic tracking-tighter opacity-10 leading-none">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <Search className="w-24 h-24 text-primary animate-pulse" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-black italic uppercase italic tracking-tight">Ghost Route Detected</h2>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">The endpoint you are looking for does not exist in our network.</p>
        </div>

        <div className="pt-8">
          <Link href="/" className="esports-button inline-flex items-center gap-2">
            Back to Command Center <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
