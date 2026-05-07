'use client';

import { motion } from 'framer-motion';
import { Shield, Trophy, Users, Search, Filter, TrendingUp, Star, ChevronRight, Activity } from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';

const MOCK_RANKINGS = [
  { rank: 1, name: 'PHOENIX CYSEC', points: 12850, solves: 142, gold: 12, silver: 8, bronze: 5, trend: 'up' },
  { rank: 2, name: 'RAVEN TEAM', points: 11420, solves: 128, gold: 8, silver: 12, bronze: 10, trend: 'down' },
  { rank: 3, name: 'ZERO DAY', points: 10100, solves: 115, gold: 10, silver: 5, bronze: 12, trend: 'up' },
  { rank: 4, name: 'HYDRA SEC', points: 9850, solves: 108, gold: 5, silver: 15, bronze: 8, trend: 'same' },
  { rank: 5, name: 'VOID RUNNERS', points: 8700, solves: 94, gold: 4, silver: 6, bronze: 15, trend: 'up' },
  { rank: 6, name: 'CYBER LORDS', points: 7900, solves: 86, gold: 3, silver: 8, bronze: 4, trend: 'down' },
  { rank: 7, name: 'ROOT ACCESS', points: 7200, solves: 78, gold: 2, silver: 4, bronze: 9, trend: 'up' },
  { rank: 8, name: 'GHOST SHELL', points: 6500, solves: 71, gold: 1, silver: 5, bronze: 3, trend: 'same' },
];

export default function ScoreboardPage() {
  return (
    <div className="min-h-screen bg-[#050816] text-white selection:bg-primary/30">
      <Navbar />

      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold tracking-widest uppercase"
            >
              <Activity className="w-4 h-4" />
              <span>Realtime Ranking System</span>
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter italic uppercase">Global <span className="text-primary">Leaderboard</span></h1>
            <p className="text-zinc-500 font-medium max-w-xl uppercase tracking-widest text-xs">The definitive ranking of the world's elite cybersecurity teams.</p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="SEARCH TEAMS..." 
                className="w-full bg-[#0B1020] border border-white/5 px-12 py-3 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>
            <button className="p-3 bg-[#0B1020] border border-white/5 hover:bg-white/5 transition-colors">
              <Filter className="w-4 h-4 text-zinc-500" />
            </button>
          </div>
        </div>

        {/* Top 3 Podium Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <PodiumCard team={MOCK_RANKINGS[1]} rank={2} />
          <PodiumCard team={MOCK_RANKINGS[0]} rank={1} featured />
          <PodiumCard team={MOCK_RANKINGS[2]} rank={3} />
        </div>

        {/* Full Table */}
        <div className="glass-card rounded-none overflow-hidden border-white/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  <th className="px-8 py-6">Rank</th>
                  <th className="px-8 py-6">Team</th>
                  <th className="px-8 py-6">Solves</th>
                  <th className="px-8 py-6">Medals</th>
                  <th className="px-8 py-6">Score</th>
                  <th className="px-8 py-6 text-right">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {MOCK_RANKINGS.map((team, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-6">
                      <span className={`text-xl font-black italic ${i < 3 ? 'text-primary' : 'text-zinc-600'}`}>
                        {team.rank.toString().padStart(2, '0')}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center font-black italic text-sm group-hover:border-primary/50 transition-colors">
                          {team.name[0]}
                        </div>
                        <span className="font-black italic uppercase tracking-tight text-white group-hover:text-primary transition-colors">{team.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold font-mono text-white">{team.solves}</span>
                        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Total Captures</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex gap-4">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                          <span className="text-xs font-bold font-mono">{team.gold}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-zinc-400 shadow-[0_0_8px_rgba(161,161,170,0.5)]" />
                          <span className="text-xs font-bold font-mono">{team.silver}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-orange-600 shadow-[0_0_8px_rgba(234,88,12,0.5)]" />
                          <span className="text-xs font-bold font-mono">{team.bronze}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-xl font-black italic text-primary">{team.points.toLocaleString()}</span>
                        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Aggregate Points</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      {team.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4 text-emerald-500 ml-auto" />
                      ) : team.trend === 'down' ? (
                        <TrendingUp className="w-4 h-4 text-rose-500 ml-auto rotate-180" />
                      ) : (
                        <div className="w-4 h-0.5 bg-zinc-700 ml-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

function PodiumCard({ team, rank, featured = false }: { team: any, rank: number, featured?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.1 }}
      className={`glass-card p-8 flex flex-col items-center text-center relative overflow-hidden group
        ${featured ? 'border-primary/30 bg-primary/5 scale-105 z-10' : 'border-white/5'}
      `}
    >
      {featured && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-indigo to-primary animate-pulse" />
      )}
      
      <div className={`text-5xl font-black italic mb-6 ${featured ? 'text-primary' : 'text-zinc-700'}`}>
        #{rank.toString().padStart(2, '0')}
      </div>

      <div className={`w-24 h-24 mb-6 flex items-center justify-center font-black italic text-4xl border-2 transition-all duration-500
        ${featured ? 'border-primary bg-primary/10 text-primary scale-110' : 'border-white/10 bg-white/5 text-white'}
      `}>
        {team.name[0]}
      </div>

      <div className="space-y-2 mb-8">
        <h3 className="text-2xl font-black italic tracking-tighter uppercase">{team.name}</h3>
        <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
          <Trophy className={`w-3 h-3 ${rank === 1 ? 'text-amber-400' : rank === 2 ? 'text-zinc-400' : 'text-orange-600'}`} />
          {rank === 1 ? 'World Champion' : rank === 2 ? 'Contender' : 'Finalist'}
        </div>
      </div>

      <div className="w-full grid grid-cols-2 gap-4 border-t border-white/5 pt-8">
        <div>
          <div className="text-xs font-black text-white">{team.points.toLocaleString()}</div>
          <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Points</div>
        </div>
        <div>
          <div className="text-xs font-black text-white">{team.solves}</div>
          <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Solves</div>
        </div>
      </div>

      {featured && (
        <Link href={`/teams/${team.name.toLowerCase().replace(' ', '-')}`} className="mt-8 text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2 hover:translate-x-1 transition-transform">
          View Profile <ChevronRight className="w-3 h-3" />
        </Link>
      )}
    </motion.div>
  );
}
