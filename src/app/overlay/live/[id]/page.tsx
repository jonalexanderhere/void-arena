'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Trophy, Zap, Clock, Terminal } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function OBSOverlay() {
  const [showNotification, setShowNotification] = useState(false);
  const [notification, setNotification] = useState<any>(null);

  // Simulation for demo
  useEffect(() => {
    const timer = setTimeout(() => {
      setNotification({
        type: 'FIRST BLOOD',
        team: 'PHOENIX_CYSEC',
        challenge: 'GHOST INJECTION',
        points: '500'
      });
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-[1920px] h-[1080px] bg-transparent text-white overflow-hidden relative">
      {/* Top Banner: Scoreboard */}
      <div className="absolute top-0 left-0 w-full p-8 flex justify-center">
        <motion.div 
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="flex items-stretch gap-1"
        >
          {/* Team A */}
          <div className="bg-[#050816]/90 backdrop-blur-xl border border-white/5 flex items-center gap-6 px-10 py-4 relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
            <div className="text-right">
              <div className="text-[12px] font-bold text-primary uppercase tracking-[0.3em]">RANK #01</div>
              <div className="text-4xl font-black tracking-tighter italic uppercase">PHOENIX</div>
            </div>
            <div className="w-16 h-16 bg-white/5 border border-white/10 flex items-center justify-center font-black text-2xl italic text-primary">P</div>
          </div>

          {/* Match Status */}
          <div className="bg-primary/20 backdrop-blur-md px-16 py-4 flex flex-col items-center justify-center border-x border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/10 animate-pulse" />
            <div className="relative z-10 flex items-center gap-10">
              <span className="text-5xl font-black italic">2</span>
              <div className="flex flex-col items-center">
                <div className="text-[12px] font-black text-primary uppercase tracking-[0.4em] mb-1">ROUND 3</div>
                <div className="text-4xl font-mono font-bold tracking-[0.2em] text-white">04:32</div>
              </div>
              <span className="text-5xl font-black italic">1</span>
            </div>
          </div>

          {/* Team B */}
          <div className="bg-[#050816]/90 backdrop-blur-xl border border-white/5 flex items-center gap-6 px-10 py-4 relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-rose-500" />
            <div className="w-16 h-16 bg-white/5 border border-white/10 flex items-center justify-center font-black text-2xl italic text-rose-500">R</div>
            <div className="text-left">
              <div className="text-[12px] font-bold text-rose-500 uppercase tracking-[0.3em]">RANK #04</div>
              <div className="text-4xl font-black tracking-tighter italic uppercase">RAVEN</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom: Ticker / Solve Feed */}
      <div className="absolute bottom-0 left-0 w-full p-8">
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="bg-[#050816]/90 backdrop-blur-xl border border-white/5 h-16 flex items-center px-8"
        >
          <div className="flex items-center gap-4 border-r border-white/10 pr-8 mr-8">
            <div className="w-3 h-3 bg-primary animate-pulse rounded-full" />
            <span className="text-sm font-black uppercase tracking-widest text-zinc-500">LIVE FEED</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="flex gap-16 animate-marquee whitespace-nowrap">
              <TickerItem team="PHOENIX" action="SOLVED" challenge="BINARY OVERFLOW" />
              <TickerItem team="RAVEN" action="SOLVED" challenge="CRYPTO VAULT" />
              <TickerItem team="ZERO DAY" action="CAPTURED" challenge="GHOST INJECTION" />
              <TickerItem team="HYDRA" action="SOLVED" challenge="FIRMWARE X" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Notifications: First Blood */}
      <AnimatePresence>
        {showNotification && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-primary/40 blur-[150px] animate-pulse" />
              <div className="relative bg-[#050816]/95 backdrop-blur-2xl border-4 border-primary p-12 flex flex-col items-center gap-6 shadow-[0_0_100px_rgba(59,130,246,0.3)]">
                <div className="flex items-center gap-4 text-primary">
                  <div className="h-[2px] w-12 bg-primary" />
                  <span className="text-2xl font-black uppercase tracking-[0.5em] italic">FIRST BLOOD</span>
                  <div className="h-[2px] w-12 bg-primary" />
                </div>
                
                <div className="text-center space-y-4">
                  <div className="text-7xl font-black italic uppercase italic italic tracking-tighter text-white">
                    {notification.team}
                  </div>
                  <div className="text-xl font-bold uppercase tracking-widest text-zinc-400">
                    Solved: <span className="text-white italic">{notification.challenge}</span>
                  </div>
                </div>

                <div className="mt-4 px-12 py-3 bg-primary text-black font-black uppercase tracking-[0.3em] italic skew-x-[-12deg]">
                  {notification.points} PTS
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Side HUD: Active Tournament */}
      <div className="absolute top-40 right-8">
        <motion.div 
          initial={{ x: 100 }}
          animate={{ x: 0 }}
          className="bg-[#050816]/80 backdrop-blur-xl border-l-4 border-primary p-6 w-72"
        >
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-primary" /> APAC REGIONALS
          </h3>
          <div className="space-y-4">
            <div className="text-2xl font-black italic uppercase italic">Regional Finals</div>
            <div className="h-1.5 w-full bg-white/5 overflow-hidden">
              <div className="h-full bg-primary w-3/4" />
            </div>
            <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              <span>Progress</span>
              <span>12 / 16 Rounds</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Decorative Overlays */}
      <div className="absolute inset-0 pointer-events-none border-[32px] border-[#050816]/20 border-double opacity-10" />
      <div className="absolute inset-0 scanline opacity-5" />
    </div>
  );
}

function TickerItem({ team, action, challenge }: any) {
  return (
    <div className="text-lg font-bold tracking-widest uppercase flex items-center gap-4">
      <span className="text-primary italic">{team}</span>
      <span className="text-zinc-500">{action}</span>
      <span className="text-white italic">{challenge}</span>
    </div>
  );
}
