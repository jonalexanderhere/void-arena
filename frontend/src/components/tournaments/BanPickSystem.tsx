'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Shield, X, Check, Timer, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';

const CATEGORIES = [
  { id: 'web', name: 'WEB EXPLOITATION', icon: '🌐' },
  { id: 'pwn', name: 'PWN / BINARY', icon: '💀' },
  { id: 'crypto', name: 'CRYPTOGRAPHY', icon: '🔐' },
  { id: 'rev', name: 'REVERSE ENG', icon: '⚙️' },
  { id: 'osint', name: 'OSINT INTEL', icon: '🔍' },
  { id: 'forensics', name: 'DIGITAL FORENSICS', icon: '📁' },
];

export function BanPickSystem() {
  const [banned, setBanned] = useState<string[]>([]);
  const [turn, setTurn] = useState<'A' | 'B'>('A');
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Auto-skip or random ban
      nextTurn();
    }
  }, [timeLeft]);

  const handleBan = (id: string) => {
    if (banned.includes(id)) return;
    setBanned([...banned, id]);
    nextTurn();
  };

  const nextTurn = () => {
    setTurn(turn === 'A' ? 'B' : 'A');
    setTimeLeft(30);
  };

  return (
    <div className="glass-card p-10 bg-[#050816]/90 border-primary/20 relative overflow-hidden">
      <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />
      
      {/* Header: Turn Indicator */}
      <div className="flex justify-between items-center mb-12">
        <TeamSlot side="A" name="PHOENIX" active={turn === 'A'} />
        
        <div className="flex flex-col items-center gap-2">
          <div className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500">Banned System Phase</div>
          <div className="flex items-center gap-4">
            <div className="h-px w-12 bg-white/10" />
            <div className="text-4xl font-mono font-bold text-primary tabular-nums">
              00:{timeLeft.toString().padStart(2, '0')}
            </div>
            <div className="h-px w-12 bg-white/10" />
          </div>
        </div>

        <TeamSlot side="B" name="RAVEN" active={turn === 'B'} />
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {CATEGORIES.map((cat) => {
          const isBanned = banned.includes(cat.id);
          return (
            <motion.button
              key={cat.id}
              whileHover={!isBanned ? { scale: 1.05, borderColor: 'rgba(59,130,246,0.5)' } : {}}
              onClick={() => handleBan(cat.id)}
              disabled={isBanned}
              className={`relative p-6 border-2 flex flex-col items-center gap-4 transition-all duration-300 group
                ${isBanned ? 'border-rose-500/20 opacity-40 cursor-not-allowed bg-rose-500/5' : 
                  turn === 'A' ? 'border-white/5 hover:border-primary/50' : 'border-white/5 hover:border-indigo-500/50'}
              `}
            >
              <div className="text-3xl grayscale group-hover:grayscale-0 transition-all">{cat.icon}</div>
              <div className="text-[10px] font-black text-center uppercase tracking-widest">{cat.name}</div>
              
              <AnimatePresence>
                {isBanned && (
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute inset-0 flex items-center justify-center bg-rose-500/10"
                  >
                    <X className="w-12 h-12 text-rose-500 rotate-12" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Selection Border Glow */}
              {!isBanned && (
                <div className={`absolute -inset-[1px] opacity-0 group-hover:opacity-100 transition-opacity blur-sm pointer-events-none
                  ${turn === 'A' ? 'bg-primary/20' : 'bg-indigo-500/20'}
                `} />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="mt-12 flex justify-center gap-12">
        <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
          <Zap className="w-4 h-4 text-amber-500" />
          <span>Strategic Bans Required: 2/6</span>
        </div>
      </div>
    </div>
  );
}

function TeamSlot({ side, name, active }: any) {
  return (
    <div className={`flex flex-col ${side === 'A' ? 'items-start' : 'items-end'} gap-2`}>
      <div className={`text-[10px] font-black uppercase tracking-[0.3em] ${active ? 'text-primary' : 'text-zinc-600'}`}>
        {side === 'A' ? 'BLUE SIDE' : 'RED SIDE'}
      </div>
      <div className={`px-8 py-3 border-2 font-black italic text-xl tracking-tighter transition-all duration-500
        ${active ? (side === 'A' ? 'border-primary bg-primary/10 text-white' : 'border-indigo-500 bg-indigo-500/10 text-white') : 'border-white/5 text-zinc-700'}
      `}>
        {name}
      </div>
      {active && (
        <motion.div 
          layoutId="turn-glow"
          className={`h-1 w-full ${side === 'A' ? 'bg-primary shadow-[0_0_15px_rgba(59,130,246,0.8)]' : 'bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.8)]'}`} 
        />
      )}
    </div>
  );
}
