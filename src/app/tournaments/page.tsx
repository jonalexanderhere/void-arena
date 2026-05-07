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

        {/* Featured Live Tournament */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative glass-card p-10 flex flex-col lg:flex-row gap-12 overflow-hidden border-primary/30 bg-primary/5"
        >
          <div className="absolute top-0 right-0 p-6">
            <div className="text-[10px] font-black text-primary flex items-center gap-2 bg-[#050816] px-4 py-2 border border-primary/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              LIVE NOW
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <div className="text-xs font-bold text-primary uppercase tracking-[0.3em]">APAC REGIONAL FINALS • ROUND 3</div>
              <h2 className="text-5xl font-black tracking-tighter italic uppercase">Elite Division Master</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-6 border-y border-white/5">
              <TournamentStat icon={<Calendar className="w-4 h-4" />} label="Schedule" value="MAY 15-20" />
              <TournamentStat icon={<Users className="w-4 h-4" />} label="Teams" value="16 / 16" />
              <TournamentStat icon={<Zap className="w-4 h-4" />} label="Prize Pool" value="$25,000" />
              <TournamentStat icon={<MapPin className="w-4 h-4" />} label="Location" value="SYDNEY, AU" />
            </div>

            <div className="flex flex-wrap gap-6 pt-4">
              <Link href="/arena" className="esports-button flex items-center gap-2 group">
                Enter Arena <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/observer" className="esports-button-outline">
                Watch Broadcast
              </Link>
            </div>
          </div>

          <div className="lg:w-96 flex flex-col gap-4">
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-2">Top Matchups</div>
            <div className="space-y-3">
              <MiniMatch team1="PHOENIX" team2="RAVEN" score="2 - 1" status="LIVE" />
              <MiniMatch team1="HYDRA" team2="ZERO_D" score="0 - 0" status="UPCOMING" />
              <MiniMatch team1="VOID_R" team2="ROOT_A" score="3 - 0" status="FINISHED" />
            </div>
          </div>
        </motion.div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_TOURNAMENTS.slice(1).map((tournament, i) => (
            <TournamentCard key={tournament.id} tournament={tournament} delay={i * 0.1} />
          ))}
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
