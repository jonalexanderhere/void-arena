'use client';

import { Navbar } from "@/components/layout/Navbar";
import { Eye, Layout, Monitor, Share2, Play, Pause, SkipForward, Radio } from "lucide-react";
import { motion } from 'framer-motion';

export default function ObserverPage() {
  return (
    <div className="min-h-screen pt-20 flex flex-col bg-[#050816] text-white">
      <Navbar />
      
      <div className="flex-1 p-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left: Live Match Feed Simulation */}
        <div className="lg:col-span-3 space-y-6">
          <div className="relative aspect-video glass-card rounded-none overflow-hidden group">
            <div className="absolute inset-0 flex items-center justify-center text-zinc-900/50">
              <Monitor className="w-48 h-48" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent)]" />
            </div>
            
            {/* Overlay Simulation (In-Feed) */}
            <div className="absolute top-0 w-full p-8 flex justify-between items-start pointer-events-none">
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="bg-[#050816]/90 backdrop-blur-xl px-6 py-3 border-l-4 border-primary"
              >
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">LIVE FEED 01</p>
                <p className="text-2xl font-black text-white italic uppercase tracking-tighter">PHOENIX vs RAVEN</p>
              </motion.div>
              
              <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-[#050816]/90 backdrop-blur-xl px-10 py-5 border-b-4 border-primary text-center"
              >
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">ROUND TIME</p>
                <p className="text-4xl font-mono font-bold text-white tabular-nums">04:32</p>
              </motion.div>

              <motion.div 
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="bg-[#050816]/90 backdrop-blur-xl px-6 py-3 border-r-4 border-primary text-right"
              >
                <div className="flex items-center gap-3 justify-end">
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest">OBSERVER MODE</span>
                  <Radio className="w-4 h-4 text-primary animate-pulse" />
                </div>
                <p className="text-lg font-black text-white italic uppercase tracking-widest">CASTER_APEX</p>
              </motion.div>
            </div>

            <div className="absolute bottom-0 w-full p-8 bg-gradient-to-t from-[#050816] to-transparent flex justify-between items-end">
              <div className="flex gap-6">
                <TeamScore name="PHOENIX" score={2} color="bg-primary" />
                <TeamScore name="RAVEN" score={1} color="bg-rose-500" />
              </div>
              <div className="flex gap-2">
                <div className="px-3 py-1 bg-primary/20 border border-primary/30 text-[10px] font-bold text-primary uppercase tracking-widest">Active: Buffer Overflow</div>
              </div>
            </div>
          </div>

          {/* Observer Controls */}
          <div className="glass-card p-6 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <ControlButton icon={<Play className="w-5 h-5" />} label="Start Match" />
              <ControlButton icon={<Pause className="w-5 h-5" />} label="Pause Match" />
              <ControlButton icon={<SkipForward className="w-5 h-5" />} label="Force Round" />
            </div>
            <div className="flex items-center gap-4">
              <div className="h-10 w-[1px] bg-white/5 mx-2" />
              <button className="esports-button !py-2 !px-6 !text-[10px] flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Stream Overlays
              </button>
            </div>
          </div>
        </div>

        {/* Right: Observer Sidebar */}
        <div className="space-y-8">
          <div className="glass-card p-6">
            <h3 className="text-xs font-black text-white italic uppercase mb-6 flex items-center gap-2 border-b border-white/5 pb-4">
              <Eye className="w-4 h-4 text-primary" />
              Match Observers
            </h3>
            <div className="space-y-3">
              <ObserverItem name="Caster_Apex" role="Main Caster" active />
              <ObserverItem name="Prod_Director" role="Director" />
              <ObserverItem name="OBS_Engine_01" role="Stream Source" />
              <ObserverItem name="Referee_Zero" role="Moderator" />
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-xs font-black text-white italic uppercase mb-6 flex items-center gap-2 border-b border-white/5 pb-4">
              <Layout className="w-4 h-4 text-primary" />
              Overlay Presets
            </h3>
            <div className="grid grid-cols-1 gap-2">
              <PresetButton label="Match HUD (Active)" active />
              <PresetButton label="Tournament Bracket" />
              <PresetButton label="Team Introduction" />
              <PresetButton label="Victory / Defeat Screen" />
              <PresetButton label="Scoreboard Fullscreen" />
            </div>
          </div>

          <div className="glass-card p-6 border-primary/20 bg-primary/5">
            <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">Stream Safe Mode</h3>
            <div className="flex items-center justify-between">
              <p className="text-[11px] text-zinc-400 font-medium">Hides flags and solutions from observer view.</p>
              <div className="w-12 h-6 bg-primary/20 rounded-full relative p-1 cursor-pointer">
                <div className="w-4 h-4 bg-primary rounded-full absolute right-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TeamScore({ name, score, color }: { name: string, score: number, color: string }) {
  return (
    <div className="flex items-center gap-4 bg-[#050816]/80 backdrop-blur-xl p-3 pr-8 border border-white/5">
      <div className={`w-10 h-10 ${color} flex items-center justify-center font-black italic text-xl transform skew-x-[-12deg]`}>{score}</div>
      <div className="text-lg font-black text-white italic uppercase tracking-tighter">{name}</div>
    </div>
  );
}

function ControlButton({ icon, label }: { icon: any, label: string }) {
  return (
    <button className="flex flex-col items-center gap-2 text-zinc-500 hover:text-primary transition-all group">
      <div className="p-3 border border-white/5 group-hover:border-primary/50 transition-colors">
        {icon}
      </div>
      <span className="text-[9px] font-black uppercase tracking-[0.2em]">{label}</span>
    </button>
  );
}

function ObserverItem({ name, role, active }: { name: string, role: string, active?: boolean }) {
  return (
    <div className={`flex items-center justify-between p-3 border transition-colors ${active ? 'bg-primary/10 border-primary/20' : 'bg-white/5 border-white/5'}`}>
      <div>
        <p className={`text-xs font-black italic uppercase ${active ? 'text-primary' : 'text-white'}`}>{name}</p>
        <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">{role}</p>
      </div>
      {active && <div className="w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)] animate-pulse" />}
    </div>
  );
}

function PresetButton({ label, active }: { label: string, active?: boolean }) {
  return (
    <button className={`w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] border transition-all
      ${active ? 'bg-primary border-primary text-black italic' : 'border-white/5 text-zinc-500 hover:border-white/20 hover:text-white'}
    `}>
      {label}
    </button>
  );
}
