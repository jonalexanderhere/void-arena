'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Trophy, Users, Search, Filter, TrendingUp, Star, ChevronRight, Activity, Terminal, Globe, User } from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState, useEffect } from 'react';

type Mode = 'classic' | 'tournament';
type Type = 'teams' | 'players';

export default function ScoreboardPage() {
  const [rankings, setRankings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<Mode>('classic');
  const [type, setType] = useState<Type>('teams');
  const [search, setSearch] = useState('');
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchRankings() {
      setLoading(true);
      try {
        let query;
        if (type === 'teams') {
          query = supabase
            .from('teams')
            .select('*')
            .order('points', { ascending: false });
        } else {
          query = supabase
            .from('profiles')
            .select('*')
            .order('points', { ascending: false });
        }
        
        const { data, error } = await query;
        if (error) throw error;
        setRankings(data || []);
      } catch (err) {
        console.error('Error fetching rankings:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchRankings();
  }, [type, mode]);

  const filteredRankings = rankings.filter(r => 
    (r.name || r.username || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050816] text-white selection:bg-primary/30">
      <Navbar />

      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold tracking-[0.3em] uppercase"
            >
              <Activity className="w-4 h-4" />
              <span>Realtime Global Scoreboard</span>
            </motion.div>
            <h1 className="text-6xl md:text-7xl font-black tracking-tighter italic uppercase leading-none">
              The <span className="text-primary italic">Arena</span> Standings
            </h1>
            
            {/* Mode & Type Selectors */}
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex bg-[#0B1020] border border-white/5 p-1">
                <button 
                  onClick={() => setMode('classic')}
                  className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'classic' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  Classic Mode
                </button>
                <button 
                  onClick={() => setMode('tournament')}
                  className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'tournament' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  Tournament
                </button>
              </div>

              <div className="flex bg-[#0B1020] border border-white/5 p-1">
                <button 
                  onClick={() => setType('teams')}
                  className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${type === 'teams' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  Elite Teams
                </button>
                <button 
                  onClick={() => setType('players')}
                  className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${type === 'players' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  Solo Players
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 w-full lg:w-96">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`SEARCH ${type.toUpperCase()}...`}
                className="w-full bg-[#0B1020] border border-white/5 px-12 py-4 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-primary/50 transition-all placeholder:text-zinc-700"
              />
            </div>
            <div className="flex justify-between items-center px-2">
              <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Showing Top {filteredRankings.length} Nodes</span>
              <button className="text-[9px] font-black text-primary uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                Sync Data <Activity className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Podium Section */}
        {!loading && filteredRankings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end pt-12">
            <PodiumCard 
              entry={filteredRankings[1]} 
              rank={2} 
              type={type}
              delay={0.2}
            />
            <PodiumCard 
              entry={filteredRankings[0]} 
              rank={1} 
              type={type}
              featured 
              delay={0.1}
            />
            <PodiumCard 
              entry={filteredRankings[2]} 
              rank={3} 
              type={type}
              delay={0.3}
            />
          </div>
        )}

        {/* Loading / Empty State */}
        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center gap-4">
             <div className="w-12 h-12 border-2 border-primary border-t-transparent animate-spin" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Deciphering Rankings...</span>
          </div>
        ) : filteredRankings.length === 0 && (
          <div className="p-32 border border-dashed border-white/10 text-center glass-card">
            <Terminal className="w-16 h-16 text-zinc-800 mx-auto mb-6" />
            <h3 className="text-2xl font-black italic uppercase text-zinc-500">Sector Offline</h3>
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-2 max-w-sm mx-auto">No data found for this configuration. Be the first to secure a capture.</p>
          </div>
        )}

        {/* Extended Rankings Table */}
        {!loading && filteredRankings.length > 3 && (
          <div className="glass-card rounded-none overflow-hidden border-white/5 bg-[#0B1020]/30">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                    <th className="px-10 py-8">RANK</th>
                    <th className="px-10 py-8">{type === 'teams' ? 'ELITE SQUAD' : 'OPERATIVE'}</th>
                    <th className="px-10 py-8">SECTORS</th>
                    <th className="px-10 py-8">EFFICIENCY</th>
                    <th className="px-10 py-8">NEURAL POINTS</th>
                    <th className="px-10 py-8 text-right">VECTOR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredRankings.slice(3).map((entry, i) => (
                    <RankRow key={entry.id} entry={entry} rank={i + 4} type={type} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function PodiumCard({ entry, rank, type, featured = false, delay = 0 }: any) {
  if (!entry) return <div className="h-0" />;
  const name = entry.name || entry.username || 'UNKNOWN';
  const logo = entry.logo_url || entry.avatar_url;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8 }}
      className={`glass-card p-10 flex flex-col items-center text-center relative overflow-hidden group
        ${featured ? 'border-primary/40 bg-primary/10 py-16 shadow-[0_0_50px_rgba(59,130,246,0.1)]' : 'border-white/5 bg-white/5'}
      `}
    >
      <div className={`absolute top-0 left-0 w-full h-1 ${rank === 1 ? 'bg-primary' : rank === 2 ? 'bg-zinc-400' : 'bg-orange-600'}`} />
      
      <div className={`text-6xl font-black italic mb-8 ${featured ? 'text-primary' : 'text-zinc-800'}`}>
        #{rank.toString().padStart(2, '0')}
      </div>

      <div className={`w-28 h-28 mb-8 flex items-center justify-center font-black italic text-5xl relative group-hover:scale-105 transition-all duration-700
        ${featured ? 'border-2 border-primary bg-primary/20 text-primary shadow-[0_0_30px_rgba(59,130,246,0.3)]' : 'border-2 border-white/10 bg-white/5 text-white'}
      `}>
        {logo ? (
          <img src={logo} className="w-full h-full object-cover" alt="Logo" />
        ) : (
          name[0]
        )}
      </div>

      <div className="space-y-3 mb-10">
        <h3 className="text-3xl font-black italic tracking-tighter uppercase leading-none group-hover:text-primary transition-colors">{name}</h3>
        <div className="flex items-center justify-center gap-3 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
          <Trophy className={`w-3.5 h-3.5 ${rank === 1 ? 'text-amber-400' : rank === 2 ? 'text-zinc-400' : 'text-orange-600'}`} />
          {rank === 1 ? 'PLATINUM ELITE' : rank === 2 ? 'GOLD CONTENDER' : 'SILVER FINALIST'}
        </div>
      </div>

      <div className="w-full grid grid-cols-2 gap-8 border-t border-white/5 pt-10">
        <div className="space-y-1">
          <div className="text-xl font-black text-white italic">{(entry.points || 0).toLocaleString()}</div>
          <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Aggregate</div>
        </div>
        <div className="space-y-1">
          <div className="text-xl font-black text-white italic">{entry.solves || 0}</div>
          <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Captures</div>
        </div>
      </div>
    </motion.div>
  );
}

function RankRow({ entry, rank, type }: any) {
  const name = entry.name || entry.username || 'UNKNOWN';
  const logo = entry.logo_url || entry.avatar_url;

  return (
    <tr className="hover:bg-white/5 transition-all duration-300 group cursor-pointer border-b border-white/5 last:border-0">
      <td className="px-10 py-8">
        <span className="text-2xl font-black italic text-zinc-700 group-hover:text-primary transition-colors">
          #{rank.toString().padStart(2, '0')}
        </span>
      </td>
      <td className="px-10 py-8">
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center font-black italic text-xl text-primary group-hover:border-primary/50 transition-all overflow-hidden">
            {logo ? <img src={logo} className="w-full h-full object-cover" alt="Av" /> : name[0]}
          </div>
          <div className="space-y-1">
            <span className="text-lg font-black italic uppercase tracking-tight text-white group-hover:text-primary transition-colors">{name}</span>
            <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest flex items-center gap-2">
              <Globe className="w-3 h-3" /> {entry.region || 'GLOBAL SECTOR'}
            </div>
          </div>
        </div>
      </td>
      <td className="px-10 py-8 text-sm font-bold font-mono text-zinc-400">
        {entry.solves || 0} <span className="text-[9px] text-zinc-600">NODES</span>
      </td>
      <td className="px-10 py-8">
        <div className="flex items-center gap-3">
           <div className="h-1 w-24 bg-white/5 overflow-hidden">
              <div className="h-full bg-primary w-2/3" />
           </div>
           <span className="text-[10px] font-black text-zinc-500 italic">64%</span>
        </div>
      </td>
      <td className="px-10 py-8">
        <span className="text-2xl font-black italic text-primary">{(entry.points || 0).toLocaleString()}</span>
      </td>
      <td className="px-10 py-8 text-right">
        <TrendingUp className="w-5 h-5 text-emerald-500 ml-auto opacity-50 group-hover:opacity-100 transition-opacity" />
      </td>
    </tr>
  );
}
