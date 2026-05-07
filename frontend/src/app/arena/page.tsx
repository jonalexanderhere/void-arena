'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, Clock, Terminal, Activity, ChevronRight, AlertCircle, Trophy } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSoundEffects } from '@/components/arena/SoundManager';

export default function ArenaHUD() {
  const [timeLeft, setTimeLeft] = useState(300); // 5:00
  const [showFirstBlood, setShowFirstBlood] = useState(false);
  const { playSound } = useSoundEffects();

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  // Demo trigger for First Blood
  const triggerFirstBlood = () => {
    setShowFirstBlood(true);
    playSound('FIRST_BLOOD');
    setTimeout(() => setShowFirstBlood(false), 5000);
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white overflow-hidden relative selection:bg-primary/30">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.1),transparent)] pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />

      {/* TOP: Scoreboard + Timer */}
      <header className="fixed top-0 left-0 w-full z-50 p-6 flex justify-center">
        <div className="flex items-stretch gap-1">
          {/* Team A */}
          <div className="glass-card flex items-center gap-4 px-8 py-3 border-r-0 relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
            <div className="text-right">
              <div className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Rank #01</div>
              <div className="text-2xl font-black tracking-tighter italic uppercase">PHOENIX</div>
            </div>
            <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center font-black text-xl italic text-primary">P</div>
          </div>

          {/* Score & Timer */}
          <div className="glass bg-primary/20 px-10 py-3 flex flex-col items-center justify-center border-x-0 relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/10 animate-pulse" />
            <div className="relative z-10 flex items-center gap-8">
              <span className="text-4xl font-black italic">2</span>
              <div className="flex flex-col items-center">
                <div className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1">ROUND 3</div>
                <div className="text-3xl font-mono font-bold tracking-widest text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  {formatTime(timeLeft)}
                </div>
              </div>
              <span className="text-4xl font-black italic">1</span>
            </div>
          </div>

          {/* Team B */}
          <div className="glass-card flex items-center gap-4 px-8 py-3 border-l-0 relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-rose-500" />
            <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center font-black text-xl italic text-rose-500">R</div>
            <div className="text-left">
              <div className="text-[10px] font-bold text-rose-500 uppercase tracking-[0.2em]">Rank #04</div>
              <div className="text-2xl font-black tracking-tighter italic uppercase">RAVEN</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Battle Area */}
      <main className="pt-32 pb-24 px-6 h-full flex gap-6">
        {/* LEFT: Challenge Info */}
        <aside className="w-96 flex flex-col gap-6">
          <div className="glass-card p-6 space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <Terminal className="w-6 h-6 text-primary" />
              <div>
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Active Challenge</h3>
                <h2 className="text-xl font-black tracking-tight italic uppercase">Binary Protocol X</h2>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-zinc-400 leading-relaxed">
                Reverse engineer the proprietary binary protocol used by the target service. Find the undocumented command that leaks the admin session token.
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white/5 border border-white/5">
                  <div className="text-[9px] font-bold text-zinc-500 uppercase mb-1">Difficulty</div>
                  <div className="text-xs font-bold text-amber-500 uppercase">Hard</div>
                </div>
                <div className="p-3 bg-white/5 border border-white/5">
                  <div className="text-[9px] font-bold text-zinc-500 uppercase mb-1">Category</div>
                  <div className="text-xs font-bold text-white uppercase">Reverse</div>
                </div>
              </div>

              <div className="space-y-2">
                <button className="w-full esports-button !py-3 !text-[10px]">Download Binary</button>
                <button className="w-full esports-button-outline !py-3 !text-[10px]">Challenge URL</button>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 bg-rose-500/5 border-rose-500/20">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-5 h-5 text-rose-500" />
              <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em]">Critical Intel</h4>
            </div>
            <p className="text-[11px] text-zinc-400">The binary uses a custom packing algorithm. Look for entropy anomalies in the header section.</p>
          </div>
        </aside>

        {/* CENTER: Submission / Interaction Area */}
        <section className="flex-1 flex flex-col items-center justify-center gap-12">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-xl space-y-8"
          >
            <div className="text-center space-y-2">
              <div className="text-[10px] font-bold text-primary uppercase tracking-[0.5em]">SUBMIT FLAG</div>
              <h2 className="text-4xl font-black italic tracking-tighter uppercase">Capture the Lead</h2>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-primary/10 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
              <input 
                type="text" 
                placeholder="FLAG{...}" 
                className="w-full bg-[#0B1020]/80 backdrop-blur-xl border-2 border-white/10 px-8 py-6 text-xl font-mono font-bold text-center tracking-widest focus:outline-none focus:border-primary transition-all uppercase"
              />
              <div className="absolute top-0 right-0 h-full flex items-center pr-4">
                <kbd className="px-2 py-1 bg-white/5 border border-white/10 text-[9px] text-zinc-500 font-bold uppercase">ENTER</kbd>
              </div>
            </div>

            <div className="flex justify-center">
              <button 
                onClick={triggerFirstBlood}
                className="esports-button group"
              >
                Verify Solution <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Cinematic First Blood Overlay */}
            <AnimatePresence>
              {showFirstBlood && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.5 }}
                  className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
                >
                  <div className="absolute inset-0 bg-rose-900/40 backdrop-blur-sm animate-pulse" />
                  <motion.div 
                    initial={{ y: 50 }}
                    animate={{ y: 0 }}
                    className="relative text-center space-y-4"
                  >
                    <div className="text-rose-500 font-black italic text-8xl tracking-tighter uppercase italic italic skew-x-[-15deg] drop-shadow-[0_0_50px_rgba(244,63,94,0.8)]">
                      FIRST BLOOD
                    </div>
                    <div className="flex items-center justify-center gap-4 text-white font-black italic text-2xl uppercase tracking-[0.5em]">
                      <div className="h-px w-20 bg-white/50" />
                      PHOENIX CLAIMS THE LEAD
                      <div className="h-px w-20 bg-white/50" />
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </section>

        {/* RIGHT: Opponent Status */}
        <aside className="w-80 flex flex-col gap-6">
          <div className="glass-card p-6">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-4">Opponent Progress</h3>
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold italic uppercase">RavenTeam</span>
                  <span className="text-[10px] font-bold text-primary uppercase">Analyzing</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: '45%' }}
                    animate={{ width: '65%' }}
                    transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
                    className="h-full bg-primary" 
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/5">
                <Activity className="w-4 h-4 text-rose-500" />
                <span className="text-[11px] font-medium text-zinc-400">High activity detected in reverse engineering category.</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Round History</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-[10px] font-bold italic">R1: WEB</span>
                <span className="text-[10px] font-bold text-emerald-500 uppercase">PHOENIX WIN</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-rose-500/10 border border-rose-500/20">
                <span className="text-[10px] font-bold italic">R2: CRYPTO</span>
                <span className="text-[10px] font-bold text-rose-500 uppercase">RAVEN WIN</span>
              </div>
            </div>
          </div>
        </aside>
      </main>

      {/* BOTTOM: Live Match Feed */}
      <footer className="fixed bottom-0 left-0 w-full p-4 border-t border-white/5 bg-[#0B1020]/90 backdrop-blur-xl z-50">
        <div className="max-w-7xl mx-auto flex items-center gap-8 overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-1 bg-primary/20 border border-primary/30 rounded-none shrink-0">
            <Zap className="w-3 h-3 text-primary" />
            <span className="text-[9px] font-black uppercase tracking-widest">Global Feed</span>
          </div>
          <div className="flex gap-12 animate-marquee whitespace-nowrap">
            <FeedTickerItem user="PHOENIX" action="SOLVED" target="BINARY PROTOCOL" round="R3" />
            <FeedTickerItem user="SYSTEM" action="TIMER" target="2:00 REMAINING" />
            <FeedTickerItem user="GHOST" action="FIRST BLOOD" target="WEB EXPLOIT" />
            <FeedTickerItem user="RAVEN" action="SOLVED" target="CRYPTO VAULT" round="R2" />
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeedTickerItem({ user, action, target, round }: any) {
  return (
    <div className="text-[10px] font-bold tracking-widest uppercase flex items-center gap-3">
      <span className="text-primary italic">{user}</span>
      <span className="text-zinc-500">{action}</span>
      <span className="text-white italic">{target}</span>
      {round && <span className="px-1.5 bg-white/10 text-zinc-400">{round}</span>}
    </div>
  );
}
