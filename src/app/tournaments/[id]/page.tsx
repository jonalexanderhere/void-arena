'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users, Calendar, ChevronLeft, Terminal, Zap, Shield, Star, Filter, Search, Download, ExternalLink, ChevronRight, Video, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Navbar } from '@/components/layout/Navbar';
import { TournamentBracket } from '@/components/tournaments/Bracket';
import { detectProvider } from '@/lib/utils/storage';

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

      let query = supabase.from('challenges').select('*, challenge_files(*)').eq('tournament_id', id as string);
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

  useEffect(() => {
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
        <div className="glass-card relative overflow-hidden group">
          {/* Banner Background */}
          <div className="absolute inset-0 h-full w-full">
            {tournament.banner_url ? (
              <img src={tournament.banner_url} className="w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-1000" alt="Banner" />
            ) : (
              <div className="absolute inset-0 bg-primary/10 opacity-20" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-[#050816]/80 to-transparent" />
          </div>

          <div className="relative z-10 p-12 space-y-8">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-3">
                <span className={`px-4 py-1 text-[10px] font-black uppercase tracking-widest ${
                  tournament.status === 'Live' ? 'bg-primary text-white' : 'bg-zinc-800 text-zinc-500'
                }`}>
                  {tournament.status}
                </span>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                  <Calendar className="w-3 h-3" /> {tournament.start_date || tournament.date}
                </span>
              </div>
              
              <div className="flex items-center gap-6 border-l border-white/10 pl-6">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                  <Trophy className="w-3 h-3 text-amber-500" /> {tournament.prize} Pool
                </span>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                  <Users className="w-3 h-3 text-primary" /> {tournament.participation_mode}
                </span>
              </div>

              <div className="flex items-center gap-4 ml-auto">
                {tournament.livestream_url && (
                  <a href={tournament.livestream_url} target="_blank" rel="noreferrer" className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all">
                    <Video className="w-4 h-4" />
                  </a>
                )}
                {tournament.discord_url && (
                  <a href={tournament.discord_url} target="_blank" rel="noreferrer" className="p-3 bg-[#5865F2]/10 border border-[#5865F2]/20 text-[#5865F2] hover:bg-[#5865F2] hover:text-white transition-all">
                    <MessageSquare className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-7xl font-black tracking-tighter italic uppercase leading-none">{tournament.name}</h1>
              <p className="text-zinc-400 text-sm max-w-3xl font-medium uppercase tracking-[0.2em] leading-relaxed">
                {tournament.description || 'Welcome to the most intense cybersecurity competition of the season.'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-12">
          {/* Sidebar Categories */}
          <aside className="w-64 space-y-8 sticky top-32 hidden lg:block">
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 px-2">Operational Sectors</h3>
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

            <div className="p-6 bg-[#0B1020] border border-white/5 space-y-4">
              <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest">Circuit Node</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest">
                  <span className="text-zinc-600">Event Hash</span>
                  <span className="text-zinc-400">{tournament.id.slice(0, 12)}</span>
                </div>
                <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest">
                  <span className="text-zinc-600">Participants</span>
                  <span className="text-zinc-400">{tournament.teams || 0} SQUADS</span>
                </div>
              </div>
              <div className="h-[2px] w-full bg-white/5 overflow-hidden">
                <div className="h-full bg-primary w-2/3 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
              </div>
            </div>
          </aside>

          {/* Main Content: Bracket & Grid */}
          <div className="flex-1 space-y-16">
            <section className="space-y-8">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-black uppercase italic tracking-widest">Tactical Brackets</h3>
                  <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">Live progression of all competitive nodes.</p>
                </div>
                <div className="flex gap-2">
                   <div className="px-3 py-1 bg-primary text-[9px] font-black uppercase tracking-widest">Realtime Active</div>
                </div>
              </div>
              <TournamentBracket />
            </section>

            <section className="space-y-8">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-black uppercase italic tracking-widest">Engagement Objectives</h3>
                  <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">Execute missions to accumulate circuit points.</p>
                </div>
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{challenges.length} Missions Detected</div>
              </div>

              {challenges.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {challenges.map((chall) => (
                    <ChallengeCard key={chall.id} challenge={chall} tournamentId={tournament.id} />
                  ))}
                </div>
              ) : (
                <div className="p-20 border border-dashed border-white/10 text-center glass-card">
                  <Terminal className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                  <h3 className="text-xl font-black italic uppercase text-zinc-500">Sector Clear</h3>
                  <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-2">No active objectives assigned to this sector.</p>
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
  // Use first challenge file if available for icon detection
  const primaryFile = challenge.challenge_files?.[0];
  const provider = primaryFile ? detectProvider(primaryFile.external_url) : null;
  const FileIcon = provider?.icon || Download;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-8 flex flex-col justify-between group cursor-pointer relative overflow-hidden border-white/5 hover:border-primary/30 transition-all duration-500"
    >
      <div className="space-y-6 relative z-10">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-black text-primary uppercase tracking-widest px-3 py-1 bg-primary/10 border border-primary/20">
            {challenge.category}
          </span>
          <span className={`text-[10px] font-black italic uppercase tracking-widest ${
            challenge.difficulty === 'insane' ? 'text-rose-500' : 
            challenge.difficulty === 'hard' ? 'text-amber-500' : 'text-emerald-500'
          }`}>
            {challenge.difficulty}
          </span>
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-black tracking-tighter italic uppercase group-hover:text-primary transition-colors leading-tight">
            {challenge.title}
          </h3>
          <div className="flex items-center gap-6 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            <span className="text-white">{(challenge.points || 100).toLocaleString()} PTS</span>
            <span className="flex items-center gap-2"><Users className="w-3.5 h-3.5" /> {challenge.solves || 0} CAPTURES</span>
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 flex gap-3">
          {challenge.challenge_files?.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-[#050816] border border-white/10 text-zinc-400 group-hover:border-primary/50 group-hover:text-primary transition-all">
              <FileIcon className="w-4 h-4" />
              <span className="text-[9px] font-black uppercase tracking-tighter">{provider?.name || 'ASSET'}</span>
            </div>
          )}
          {challenge.challenge_url && (
            <div className="flex items-center gap-2 px-3 py-2 bg-[#050816] border border-white/10 text-zinc-400 group-hover:border-primary/50 group-hover:text-primary transition-all">
              <ExternalLink className="w-4 h-4" />
              <span className="text-[9px] font-black uppercase tracking-tighter">ENDPOINT</span>
            </div>
          )}
        </div>
      </div>

      <Link 
        href={`/classic/challenge/${challenge.id}?tid=${tournamentId}`} 
        className="mt-8 flex items-center justify-center gap-3 w-full py-4 bg-[#0B1020] border border-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 group-hover:bg-primary group-hover:text-white transition-all shadow-xl"
      >
        INITIATE MISSION <ChevronRight className="w-4 h-4" />
      </Link>
    </motion.div>
  );
}
