'use client';

import { motion } from 'framer-motion';
import { Trophy, Calendar, Users, MapPin, Zap, ChevronRight, Activity, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { TournamentBracket } from '@/components/tournaments/Bracket';

const MOCK_TOURNAMENTS = [
  { 
    id: 1, 
    name: 'APAC REGIONAL FINALS', 
    type: 'Swiss', 
    status: 'Live', 
    date: 'MAY 15-20, 2026',
    teams: 16,
    prize: '$25,000',
    region: 'APAC',
    color: 'border-primary'
  },
  { 
    id: 2, 
    name: 'GLOBAL INVITATIONAL 2026', 
    type: 'Double Elimination', 
    status: 'Upcoming', 
    date: 'JUNE 02, 2026',
    teams: 32,
    prize: '$100,000',
    region: 'GLOBAL',
    color: 'border-white/5'
  },
  { 
    id: 3, 
    name: 'ROOKIE CUP #42', 
    type: 'Single Elimination', 
    status: 'Upcoming', 
    date: 'MAY 28, 2026',
    teams: 64,
    prize: '$5,000',
    region: 'NA/EU',
    color: 'border-white/5'
  },
  { 
    id: 4, 
    name: 'CYBER JAWARA STUDENT', 
    type: 'Round Robin', 
    status: 'Completed', 
    date: 'APRIL 10, 2026',
    teams: 128,
    prize: 'Scholarships',
    region: 'SEA',
    color: 'border-white/5'
  },
];

export default function TournamentsPage() {
  return (
    <div className="min-h-screen bg-[#050816] text-white selection:bg-primary/30">
      <Navbar />

      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold tracking-widest uppercase"
            >
              <Activity className="w-4 h-4" />
              <span>Elite Circuit 2026</span>
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter italic uppercase">Active <span className="text-primary">Tournaments</span></h1>
            <p className="text-zinc-500 font-medium max-w-xl uppercase tracking-widest text-xs">Join the world's most prestigious cybersecurity competitions.</p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="SEARCH EVENTS..." 
                className="w-full bg-[#0B1020] border border-white/5 px-12 py-3 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>
            <button className="p-3 bg-[#0B1020] border border-white/5 hover:bg-white/5 transition-colors">
              <Filter className="w-4 h-4 text-zinc-500" />
            </button>
          </div>
        </div>

        {/* No Active Tournaments State */}
        <div className="glass-card p-20 flex flex-col items-center justify-center text-center space-y-6 border-dashed border-white/10">
          <div className="p-6 bg-white/5 rounded-full opacity-20">
            <Trophy className="w-16 h-16" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black italic uppercase italic tracking-tight">Circuit Offline</h2>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest max-w-sm">There are no active tournaments scheduled at this moment. Stay tuned for the next season announcements.</p>
          </div>
          <Link href="/dashboard" className="esports-button !px-10">Back to Dashboard</Link>
        </div>

        {/* Bracket System Section */}
        <section className="pt-20 space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-black italic uppercase tracking-tighter">Live <span className="text-primary">Brackets</span></h2>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Real-time match progression for APAC REGIONALS.</p>
            </div>
            <button className="esports-button flex items-center gap-2">
              <Zap className="w-4 h-4" /> Join Tournament
            </button>
          </div>
          <TournamentBracket />
        </section>
      </main>
    </div>
  );
}

function TournamentStat({ icon, label, value }: any) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
        {icon}
        {label}
      </div>
      <div className="text-sm font-black italic uppercase tracking-tight text-white">{value}</div>
    </div>
  );
}

function MiniMatch({ team1, team2, score, status }: any) {
  return (
    <div className="p-4 bg-white/5 border border-white/5 hover:border-white/10 transition-colors flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-[11px] font-black italic italic italic">{team1}</span>
        <span className="text-[9px] font-bold text-zinc-700">VS</span>
        <span className="text-[11px] font-black italic italic italic">{team2}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono font-bold text-primary">{score}</span>
        <div className={`w-1.5 h-1.5 rounded-full ${status === 'LIVE' ? 'bg-primary animate-pulse' : 'bg-zinc-700'}`} />
      </div>
    </div>
  );
}

function TournamentCard({ tournament, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`glass-card p-8 space-y-6 group hover:border-primary/30 transition-all duration-500 ${tournament.color}`}
    >
      <div className="flex items-center justify-between">
        <div className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest ${
          tournament.status === 'Live' ? 'bg-primary/20 text-primary' : 
          tournament.status === 'Upcoming' ? 'bg-indigo/20 text-indigo' : 'bg-zinc-800 text-zinc-500'
        }`}>
          {tournament.status}
        </div>
        <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{tournament.region}</span>
      </div>

      <div className="space-y-1">
        <h3 className="text-2xl font-black italic tracking-tighter uppercase group-hover:text-primary transition-colors">{tournament.name}</h3>
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{tournament.type}</p>
      </div>

      <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-6">
        <div>
          <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Schedule</div>
          <div className="text-xs font-black italic uppercase">{tournament.date}</div>
        </div>
        <div>
          <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Prize Pool</div>
          <div className="text-xs font-black italic uppercase text-primary">{tournament.prize}</div>
        </div>
      </div>

      <button className="w-full py-4 border border-white/10 hover:border-primary/50 text-[10px] font-black uppercase tracking-widest transition-all hover:bg-primary/5">
        View Event Detail
      </button>
    </motion.div>
  );
}
