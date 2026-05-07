'use client';

import { motion } from 'framer-motion';
import { Shield, Users, UserPlus, Search, Filter, Star, Activity, ChevronRight, Mail, Trophy } from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';

const MOCK_TEAMS = [
  { name: 'PHOENIX CYSEC', members: 5, rank: 1, wins: 42, score: 12850, status: 'Recruiting' },
  { name: 'RAVEN TEAM', members: 4, rank: 2, wins: 38, score: 11420, status: 'Full' },
  { name: 'ZERO DAY', members: 3, rank: 3, wins: 31, score: 10100, status: 'Recruiting' },
  { name: 'HYDRA SEC', members: 5, rank: 4, wins: 29, score: 9850, status: 'Full' },
  { name: 'VOID RUNNERS', members: 4, rank: 5, wins: 24, score: 8700, status: 'Recruiting' },
  { name: 'CYBER LORDS', members: 5, rank: 6, wins: 18, score: 7900, status: 'Full' },
];

export default function TeamsPage() {
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
              <Users className="w-4 h-4" />
              <span>Squad Discovery</span>
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter italic uppercase">Team <span className="text-primary">Directory</span></h1>
            <p className="text-zinc-500 font-medium max-w-xl uppercase tracking-widest text-xs">Join an existing squad or create your own to dominate the arena.</p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <button className="esports-button !px-6 !py-3 flex items-center gap-2">
              <UserPlus className="w-4 h-4" /> Create Team
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
          <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-hover:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="SEARCH TEAMS..." 
              className="w-full bg-[#0B1020] border border-white/5 px-12 py-3 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>
          <div className="flex items-center gap-6">
            <div className="flex gap-4">
              <FilterButton label="All" active />
              <FilterButton label="Recruiting" />
              <FilterButton label="Elite" />
            </div>
            <div className="h-8 w-[1px] bg-white/5" />
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              {MOCK_TEAMS.length} squads active
            </div>
          </div>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_TEAMS.map((team, i) => (
            <TeamCard key={i} team={team} delay={i * 0.1} />
          ))}
        </div>

        {/* My Team Section (Quick Access) */}
        <div className="pt-20 space-y-8">
          <h2 className="text-2xl font-black italic uppercase italic italic tracking-tight flex items-center gap-3">
            <Shield className="w-6 h-6 text-primary" /> My Squad
          </h2>
          <div className="glass-card p-10 bg-primary/5 border-primary/20 flex flex-col md:flex-row items-center gap-12">
            <div className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center font-black italic text-primary">
              {myTeam?.name?.[0] || '?'}
            </div>
            <div className="flex-1 space-y-6">
              <div className="space-y-1 text-center md:text-left">
                <div className="text-xs font-bold text-primary uppercase tracking-[0.3em]">YOU ARE THE CAPTAIN</div>
                <h3 className="text-4xl font-black tracking-tighter italic uppercase">{myTeam?.name || 'N/A'}</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-6 border-y border-white/5">
                <TeamStat label="Members" value={`${myTeam?.members || 0} / 5`} />
                <TeamStat label="Global Rank" value={`#0${myTeam?.rank || 0}`} highlight />
                <TeamStat label="Matches" value={myTeam?.wins ? (myTeam.wins * 3).toString() : '0'} />
                <TeamStat label="Win Rate" value="86%" />
              </div>
              <div className="flex flex-wrap gap-4">
                <button className="esports-button !px-8 !py-3 !text-xs">Manage Roster</button>
                <button className="esports-button-outline !px-8 !py-3 !text-xs">Invite Players</button>
              </div>
            </div>
            <div className="w-full md:w-80 space-y-4">
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-2">Recent Team Activity</div>
              <div className="space-y-2">
                <ActivityRow user="Raven_X" action="joined" time="2d ago" />
                <ActivityRow user="System" action="ranked up" time="4d ago" highlight />
                <ActivityRow user="Admin" action="invited" time="5d ago" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function FilterButton({ label, active = false }: any) {
  return (
    <button className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 border transition-all
      ${active ? 'bg-primary border-primary text-white' : 'border-white/5 text-zinc-500 hover:border-white/10 hover:text-white'}
    `}>
      {label}
    </button>
  );
}

function TeamCard({ team, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-card p-8 space-y-6 group cursor-pointer border-white/5 hover:border-primary/30 transition-all duration-500"
    >
      <div className="flex justify-between items-start">
        <div className="w-16 h-16 bg-white/5 border border-white/10 flex items-center justify-center font-black italic text-2xl text-primary group-hover:border-primary/50 transition-colors">
          {team?.name?.[0] || '?'}
        </div>
        <div className={`px-2 py-1 text-[9px] font-black uppercase tracking-widest ${
          team?.status === 'Recruiting' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-zinc-800 text-zinc-500'
        }`}>
          {team?.status || 'Unknown'}
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-xl font-black italic tracking-tighter uppercase group-hover:text-primary transition-colors">{team.name}</h3>
        <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
          <Star className="w-3 h-3 text-amber-500" />
          Rank #{team.rank} • {team.members} Members
        </div>
      </div>

      <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
        <div>
          <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Total Wins</div>
          <div className="text-xs font-black italic uppercase">{team.wins}</div>
        </div>
        <div>
          <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Score</div>
          <div className="text-xs font-black italic uppercase text-primary">{team.score.toLocaleString()}</div>
        </div>
      </div>

      <button className="w-full flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:translate-x-1 transition-transform pt-2">
        View Roster <ChevronRight className="w-3 h-3" />
      </button>
    </motion.div>
  );
}

function TeamStat({ label, value, highlight = false }: any) {
  return (
    <div className="space-y-1">
      <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{label}</div>
      <div className={`text-xl font-black italic uppercase tracking-tighter ${highlight ? 'text-primary' : 'text-white'}`}>{value}</div>
    </div>
  );
}

function ActivityRow({ user, action, time, highlight = false }: any) {
  return (
    <div className="flex items-center justify-between p-2 bg-white/5 border border-white/5 text-[10px]">
      <div className="flex items-center gap-2">
        <span className={`font-black italic ${highlight ? 'text-primary' : 'text-zinc-300'}`}>{user}</span>
        <span className="text-zinc-600 font-bold uppercase">{action}</span>
      </div>
      <span className="text-zinc-700 font-bold">{time}</span>
    </div>
  );
}
