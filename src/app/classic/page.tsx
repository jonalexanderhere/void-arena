'use client';

import { motion } from 'framer-motion';
import { Shield, Terminal, Search, Filter, Download, ExternalLink, Users, Star, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const CATEGORIES = [
  'All', 'Web Exploitation', 'Cryptography', 'Reverse Engineering', 'Pwn', 'Forensics', 'OSINT', 'Cloud', 'Mobile', 'AI Security'
];

export default function ClassicModePage() {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchChallenges() {
      try {
        let query = supabase.from('challenges').select('*');
        
        if (selectedCategory !== 'All') {
          query = query.eq('category', selectedCategory);
        }

        const { data, error } = await query;
        if (error) throw error;
        setChallenges(data || []);
      } catch (err) {
        console.error('Error fetching challenges:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchChallenges();
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      {/* Top Navbar */}
      <div className="h-16 border-b border-white/5 bg-[#0B1020]/80 backdrop-blur-xl sticky top-0 z-40 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-white/5 rounded-none transition-colors border border-transparent hover:border-white/10">
            <Shield className="w-5 h-5 text-primary" />
          </Link>
          <div className="h-4 w-[1px] bg-white/10" />
          <h1 className="text-sm font-black uppercase tracking-widest italic">Classic Mode <span className="text-zinc-500 mx-2">/</span> <span className="text-primary">Challenges</span></h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-zinc-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Team Score: <span className="text-white">12,850</span></span>
          </div>
          <div className="h-4 w-[1px] bg-white/10" />
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Global Rank: <span className="text-white">#01</span></span>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar Categories */}
        <aside className="w-72 min-h-[calc(100vh-64px)] border-r border-white/5 bg-[#0B1020]/30 p-6 space-y-8 sticky top-16 hidden lg:block">
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 px-2">Categories</h3>
            <div className="space-y-1">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all duration-300 border-l-2 ${
                    selectedCategory === cat 
                      ? 'bg-primary/10 text-primary border-primary' 
                      : 'text-zinc-500 border-transparent hover:text-white hover:bg-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 bg-primary/5 border border-primary/20 rounded-none space-y-3">
            <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest">Global Status</h4>
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-zinc-500">SOLVES</span>
              <span>1,242</span>
            </div>
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-zinc-500">TEAMS</span>
              <span>452</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mt-2">
              <div className="h-full bg-primary w-3/4" />
            </div>
          </div>
        </aside>

        {/* Challenge Grid */}
        <main className="flex-1 p-6 lg:p-10 space-y-10">
          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
            <div className="relative flex-1 max-w-md group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-hover:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="SEARCH CHALLENGES..." 
                className="w-full bg-[#0B1020] border border-white/5 px-12 py-3 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>
            <div className="flex items-center gap-4">
              <button className="p-3 bg-[#0B1020] border border-white/5 hover:bg-white/5 transition-colors">
                <Filter className="w-4 h-4 text-zinc-500" />
              </button>
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Showing {challenges.length} Challenges
              </div>
            </div>
          </div>

          {/* Grid */}
          {challenges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {challenges.map((chall, i) => (
                <ChallengeCard key={chall.id} challenge={chall} delay={i * 0.1} />
              ))}
            </div>
          ) : (
            <div className="p-20 border border-dashed border-white/10 text-center glass-card">
              <Terminal className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
              <h3 className="text-xl font-black italic uppercase text-zinc-500">System Offline</h3>
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-2">No challenges are currently available in this sector.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function ChallengeCard({ challenge, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-card p-6 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 -mr-12 -mt-12 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors duration-500" />
      
      <div className="space-y-4 relative z-10">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest px-2 py-1 bg-primary/10 border border-primary/20">
            {challenge.category}
          </span>
          <span className={`text-[10px] font-bold uppercase tracking-widest ${
            challenge.difficulty === 'Insane' ? 'text-rose-500' : 
            challenge.difficulty === 'Hard' ? 'text-amber-500' : 'text-emerald-500'
          }`}>
            {challenge.difficulty}
          </span>
        </div>

        <div className="space-y-1">
          <h3 className="text-xl font-black tracking-tight italic uppercase group-hover:text-primary transition-colors">
            {challenge.title}
          </h3>
          <div className="flex items-center gap-4 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
            <span>{challenge.points} PTS</span>
            <span>•</span>
            <span>{challenge.solves} SOLVES</span>
          </div>
        </div>

        <div className="pt-4 border-t border-white/5 space-y-3">
          <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">First Blood</div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/5 border border-white/10 flex items-center justify-center font-black italic text-xs text-rose-500">
              {challenge?.firstBlood?.[0] || '?'}
            </div>
            <div>
              <div className="text-[11px] font-black italic text-white uppercase tracking-tight">{challenge.firstBlood}</div>
              <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Captured</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between relative z-10">
        <div className="flex gap-2">
          <div className="p-2 bg-white/5 border border-white/10 hover:bg-primary/20 hover:border-primary/30 transition-colors">
            <Download className="w-3.5 h-3.5 text-zinc-400 group-hover:text-primary" />
          </div>
          <div className="p-2 bg-white/5 border border-white/10 hover:bg-primary/20 hover:border-primary/30 transition-colors">
            <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-primary" />
          </div>
        </div>
        <Link href={`/classic/challenge/${challenge.id}`} className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-primary hover:translate-x-1 transition-transform">
          View Detail <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
    </motion.div>
  );
}
