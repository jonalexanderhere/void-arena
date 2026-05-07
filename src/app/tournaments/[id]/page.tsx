'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users, Calendar, ChevronLeft, Terminal, Zap, Shield, Star, Filter, Search, Download, ExternalLink, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Navbar } from '@/components/layout/Navbar';
import { TournamentBracket } from '@/components/tournaments/Bracket';

const CATEGORIES = [
  'All', 'Web Exploitation', 'Cryptography', 'Reverse Engineering', 'Pwn', 'Forensics', 'OSINT', 'Cloud', 'Mobile', 'AI Security'
];

export default function TournamentDetailPage() {
  const { id } = useParams();
  const [tournament, setTournament] = useState<any>(null);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchTournament() {
      if (!id || Array.isArray(id)) return;
      
      try {
        const { data: tourney, error } = await supabase
          .from('tournaments')
          .select('*')
          .eq('id', id as string)
          .single();
        
        if (error) throw error;
        setTournament(tourney);

        let query = supabase.from('challenges').select('*').eq('tournament_id', id as string);
        if (selectedCategory !== 'All') {
          query = query.eq('category', selectedCategory);
        }
        
        const { data: challs, error: challError } = await query;
        if (!challError) setChallenges(challs || []);

      } catch (err) {
        console.error('Error fetching tournament detail:', err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchTournament();
  }, [id, selectedCategory]);

  if (loading) return (
    <div className="min-h-screen bg-[#050816] flex items-center justify-center">
      <div className="w-12 h-12 border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );

  if (!tournament) return (
    <div className="min-h-screen bg-[#050816] text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-black uppercase italic mb-4">Event Not Found</h1>
      <Link href="/tournaments" className="esports-button">Back to Circuit</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050816] text-white selection:bg-primary/30">
      <Navbar />

      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto space-y-12">
        <Link href="/tournaments" className="inline-flex items-center gap-2 text-[10px] font-bold text-zinc-500 hover:text-primary transition-colors uppercase tracking-widest group">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Circuit
        </Link>

        {/* Tournament Header */}
        <div className="glass-card p-12 relative overflow-hidden border-primary/20 bg-primary/5">
          <div className="relative z-10 space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest ${
                tournament.status === 'Live' ? 'bg-primary/20 text-primary' : 'bg-zinc-800 text-zinc-500'
              }`}>
                {tournament.status}
              </span>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <Calendar className="w-3 h-3" /> {tournament.start_date || tournament.date}
              </span>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <Trophy className="w-3 h-3 text-amber-500" /> {tournament.prize} Prize Pool
              </span>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <Users className="w-3 h-3 text-primary" /> {tournament.participation_mode} MODE
              </span>
            </div>
            
            <h1 className="text-6xl font-black tracking-tighter italic uppercase">{tournament.name}</h1>
            <p className="text-zinc-400 text-sm max-w-2xl font-medium uppercase tracking-widest">
              {tournament.description || 'Welcome to the most intense cybersecurity competition of the season.'}
            </p>
          </div>
        </div>

        <div className="flex gap-12">
          {/* Sidebar Categories */}
          <aside className="w-64 space-y-8 sticky top-32 hidden lg:block">
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 px-2">Sector Filter</h3>
              <div className="space-y-1">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-all duration-300 border-l-2 ${
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

            <div className="p-6 bg-primary/5 border border-primary/20 space-y-4">
              <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest">Live Progress</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase">
                  <span className="text-zinc-500">Tournament ID</span>
                  <span className="text-zinc-300">#{tournament.id.slice(0, 8)}</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold uppercase">
                  <span className="text-zinc-500">Participants</span>
                  <span className="text-zinc-300">{tournament.teams || 0}</span>
                </div>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-2/3 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
              </div>
            </div>
          </aside>

          {/* Main Content: Bracket & Grid */}
          <div className="flex-1 space-y-12">
            <section className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h3 className="text-sm font-bold uppercase tracking-widest">Tactical Overview</h3>
                <div className="flex gap-2">
                   <div className="px-3 py-1 bg-white/5 text-[9px] font-bold uppercase tracking-widest border border-white/10">Bracket</div>
                   <div className="px-3 py-1 bg-primary text-[9px] font-black uppercase tracking-widest">Live</div>
                </div>
              </div>
              <TournamentBracket />
            </section>

            <section className="space-y-8">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h3 className="text-sm font-bold uppercase tracking-widest">Operational Objectives</h3>
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{challenges.length} Missions Identified</div>
              </div>

              {challenges.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {challenges.map((chall) => (
                    <ChallengeCard key={chall.id} challenge={chall} tournamentId={tournament.id} />
                  ))}
                </div>
              ) : (
                <div className="p-20 border border-dashed border-white/10 text-center glass-card">
                  <Terminal className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                  <h3 className="text-xl font-black italic uppercase text-zinc-500">System Offline</h3>
                  <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-2">No objectives assigned to this sector yet.</p>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

function ChallengeCard({ challenge, tournamentId }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 flex flex-col justify-between group cursor-pointer relative overflow-hidden border-white/5 hover:border-primary/30 transition-all duration-500"
    >
      <div className="space-y-4 relative z-10">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-black text-primary uppercase tracking-widest px-2 py-1 bg-primary/10 border border-primary/20">
            {challenge.category}
          </span>
          <span className={`text-[9px] font-black uppercase tracking-widest ${
            challenge.difficulty === 'Insane' ? 'text-rose-500' : 
            challenge.difficulty === 'Hard' ? 'text-amber-500' : 'text-emerald-500'
          }`}>
            {challenge.difficulty}
          </span>
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-black tracking-tight italic uppercase group-hover:text-primary transition-colors">
            {challenge.title}
          </h3>
          <div className="flex items-center gap-4 text-[9px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
            <span>{challenge.points} PTS</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {challenge.solves || 0} Solves</span>
          </div>
        </div>

        <div className="pt-4 border-t border-white/5 flex gap-2">
          {challenge.file_url && (
            <div className="p-2 bg-white/5 border border-white/10 hover:bg-primary/20 hover:border-primary/30 transition-colors">
              <Download className="w-3 h-3 text-zinc-400 group-hover:text-primary" />
            </div>
          )}
          {challenge.challenge_url && (
            <div className="p-2 bg-white/5 border border-white/10 hover:bg-primary/20 hover:border-primary/30 transition-colors">
              <ExternalLink className="w-3 h-3 text-zinc-400 group-hover:text-primary" />
            </div>
          )}
        </div>
      </div>

      <Link 
        href={`/classic/challenge/${challenge.id}?tid=${tournamentId}`} 
        className="mt-6 flex items-center justify-center gap-2 w-full py-3 bg-[#0B1020] border border-white/5 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 group-hover:bg-primary group-hover:text-white transition-all"
      >
        Engage Objective <ChevronRight className="w-3 h-3" />
      </Link>
    </motion.div>
  );
}
