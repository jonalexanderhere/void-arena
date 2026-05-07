'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users, Calendar, ChevronLeft, Terminal, Zap, Shield, Star } from 'lucide-react';
import Link from 'next/link';
import { getSupabase } from '@/lib/supabase';
import { Navbar } from '@/components/layout/Navbar';
import { TournamentBracket } from '@/components/tournaments/Bracket';

export default function TournamentDetailPage() {
  const { id } = useParams();
  const [tournament, setTournament] = useState<any>(null);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTournament() {
      if (!id || Array.isArray(id)) return;
      
      try {
        const supabase = getSupabase();
        
        // Fetch tournament
        const { data: tourney, error } = await supabase
          .from('tournaments')
          .select('*')
          .eq('id', id as string)
          .single();
        
        if (error) throw error;
        setTournament(tourney);

        // Fetch associated challenges (via a many-to-many link table or direct FK)
        const { data: challs, error: challError } = await (supabase as any)
          .from('challenges')
          .select('*')
          .eq('tournament_id', id as string); // Assuming simple FK for demo
        
        if (!challError) setChallenges(challs || []);

      } catch (err) {
        console.error('Error fetching tournament detail:', err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchTournament();
  }, [id]);

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
                <Calendar className="w-3 h-3" /> {tournament.date}
              </span>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <Trophy className="w-3 h-3 text-amber-500" /> {tournament.prize} Prize Pool
              </span>
            </div>
            
            <h1 className="text-6xl font-black tracking-tighter italic uppercase">{tournament.name}</h1>
            <p className="text-zinc-400 text-sm max-w-2xl font-medium uppercase tracking-widest">
              {tournament.description || 'Welcome to the most intense cybersecurity competition of the season.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content: Bracket/Challenges */}
          <div className="lg:col-span-2 space-y-12">
            <section className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-widest border-b border-white/5 pb-4">Live Bracket</h3>
              <TournamentBracket />
            </section>

            <section className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-widest border-b border-white/5 pb-4">Tournament Challenges</h3>
              {challenges.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {challenges.map((c) => (
                    <Link key={c.id} href={`/classic/challenge/${c.id}?tid=${tournament.id}`} className="glass-card p-6 hover:border-primary/50 transition-colors group">
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-[9px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 border border-primary/20">{c.category}</span>
                        <Star className="w-4 h-4 text-zinc-700 group-hover:text-amber-500 transition-colors" />
                      </div>
                      <h4 className="font-black italic uppercase tracking-tight group-hover:text-primary transition-colors">{c.title}</h4>
                      <div className="mt-4 flex items-center justify-between text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                        <span>{c.points} PTS</span>
                        <span>{c.solves || 0} SOLVES</span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-12 border border-dashed border-white/10 text-center opacity-30">
                  <Terminal className="w-8 h-8 mx-auto mb-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">No challenges assigned yet.</span>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar: Participants & Stats */}
          <div className="space-y-8">
            <div className="glass-card p-8 space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-widest border-b border-white/5 pb-4">Participants</h3>
              <div className="space-y-3">
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Team Count: <span className="text-white font-black">{tournament.teams || 0}</span></div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-2/3" />
                </div>
                <button className="w-full py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-[9px] font-black uppercase tracking-widest transition-all">
                  View Full Roster
                </button>
              </div>
            </div>

            <div className="glass-card p-8 space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-widest border-b border-white/5 pb-4">Live Updates</h3>
              <div className="space-y-4">
                <div className="flex gap-3 text-[10px]">
                  <Zap className="w-4 h-4 text-primary shrink-0" />
                  <p className="text-zinc-400 font-medium">Tournament started. All systems nominal.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
