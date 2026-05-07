'use client';

import { motion } from 'framer-motion';
import { Shield, Trophy, Zap, Users, ChevronRight, Activity, Terminal } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function LandingPage() {
  const [onlinePlayers, setOnlinePlayers] = useState(1243);
  const [user, setUser] = useState<any>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    const interval = setInterval(() => {
      setOnlinePlayers(prev => prev + Math.floor(Math.random() * 5) - 2);
    }, 3000);

    return () => {
      subscription.unsubscribe();
      clearInterval(interval);
    };
  }, [supabase]);

  return (
    <div className="min-h-screen bg-[#050816] text-white overflow-x-hidden selection:bg-primary/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050816]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-4 group">
              <div className="w-12 h-12 relative flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <img src="/logo.png" alt="VOID ARENA Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-2xl font-black tracking-tighter italic uppercase">VOID <span className="text-primary">ARENA</span></span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/arena" className="nav-link uppercase tracking-widest text-xs">Arena</Link>
              <Link href="/classic" className="nav-link uppercase tracking-widest text-xs">Classic</Link>
              <Link href="/tournaments" className="nav-link uppercase tracking-widest text-xs">Tournaments</Link>
              <Link href="/scoreboard" className="nav-link uppercase tracking-widest text-xs">Scoreboard</Link>
            </div>
          </div>
          <div className="flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-black italic uppercase text-white tracking-tight">
                    {user.email?.split('@')?.[0] ?? 'Recruit_00'}
                  </p>
                  <Link href="/dashboard" className="text-[9px] text-primary font-bold uppercase tracking-widest hover:underline">Dashboard</Link>
                </div>
                <Link href="/profile" className="w-10 h-10 rounded-none border border-white/10 bg-white/5 flex items-center justify-center text-primary hover:border-primary/50 transition-colors">
                  <Shield className="w-5 h-5" />
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors">Login</Link>
                <Link href="/register" className="esports-button !px-6 !py-2 !text-xs">Join Arena</Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen flex flex-col lg:flex-row items-center gap-12">
        {/* Left Side: Typography */}
        <div className="flex-1 space-y-8 z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase"
          >
            <Activity className="w-4 h-4" />
            <span>Realtime Esports Platform</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <h1 className="text-7xl md:text-9xl font-black tracking-tighter italic leading-none">
              COMPETE.<br />
              CAPTURE.<br />
              <span className="text-primary">DOMINATE.</span>
            </h1>
            <p className="text-xl text-zinc-400 max-w-xl font-medium pt-4">
              The elite cybersecurity esports ecosystem. Realtime speedruns, automated brackets, and professional observer tools.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center gap-6 pt-6"
          >
            <Link href="/arena" className="esports-button flex items-center gap-2 group">
              Enter Arena <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/tournaments" className="esports-button-outline">
              Watch Tournament
            </Link>
          </motion.div>

          <div className="flex items-center gap-8 pt-12 border-t border-white/5">
            <div>
              <div className="text-3xl font-black tracking-tighter italic">{onlinePlayers.toLocaleString()}</div>
              <div className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Players Online</div>
            </div>
            <div>
              <div className="text-3xl font-black tracking-tighter italic">$50,000+</div>
              <div className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Prize Pool</div>
            </div>
            <div>
              <div className="text-3xl font-black tracking-tighter italic">24/7</div>
              <div className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Active Matches</div>
            </div>
          </div>
        </div>

        {/* Right Side: Live Competition Panel */}
        <div className="flex-1 w-full max-w-2xl lg:max-w-none relative group">
          <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full group-hover:bg-primary/30 transition-colors duration-700" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="relative glass-card rounded-none overflow-hidden border-white/10"
          >
            {/* Live Panel Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse delay-75" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse delay-150" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Live Competition Feed</span>
              </div>
              <div className="text-[10px] font-bold text-primary flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                LIVE
              </div>
            </div>

            {/* Scoreboard Preview */}
            <div className="p-6 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  <span>Top Teams</span>
                  <span>Score</span>
                </div>
                {([] as any[]).map((team, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 group-hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-zinc-600 font-black italic">0{i+1}</span>
                      <span className={`font-black tracking-tight italic ${team.color}`}>{team.name}</span>
                    </div>
                    <span className="font-mono text-sm font-bold">{team.score}</span>
                  </div>
                ))}
                {([] as any[]).length === 0 && (
                  <div className="p-4 bg-white/5 border border-dashed border-white/10 text-center">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">No Active Rankings</span>
                  </div>
                )}
              </div>

              {/* Solve Feed */}
              <div className="space-y-3">
                <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Recent Solves</div>
                <div className="space-y-2">
                  {([] as any[]).map((solve, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-primary/10 border border-primary/20">
                      <div className="p-1.5 bg-primary/20 rounded">
                        <Terminal className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <div className="flex-1 text-[11px]">
                        <span className="font-bold text-primary italic">{solve.team}</span>
                        <span className="text-zinc-400"> captured </span>
                        <span className="font-bold text-white italic">{solve.challenge}</span>
                      </div>
                      <span className="text-[9px] font-bold text-zinc-600">{solve.time}</span>
                    </div>
                  ))}
                  {[].length === 0 && (
                    <div className="p-4 bg-white/5 border border-dashed border-white/10 text-center">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Awaiting First Blood</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Match Ticker */}
              <div className="pt-2 border-t border-white/5">
                <div className="flex items-center gap-4 animate-scroll whitespace-nowrap overflow-hidden">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Upcoming: APAC Regionals • Final Round • 18:00 UTC</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Decorative floating elements */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-12 -right-12 w-24 h-24 glass border-white/10 flex items-center justify-center rotate-12"
          >
            <Trophy className="w-10 h-10 text-primary" />
          </motion.div>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-8 -left-8 w-20 h-20 glass border-white/10 flex items-center justify-center -rotate-12"
          >
            <Zap className="w-8 h-8 text-indigo" />
          </motion.div>
        </div>
      </section>

      {/* Decorative Scanline Effect */}
      <div className="fixed inset-0 pointer-events-none scanline z-50 opacity-20" />
    </div>
  );
}
