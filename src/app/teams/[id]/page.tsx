'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Trophy, Users, Star, Activity, Terminal, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Navbar } from '@/components/layout/Navbar';

export default function TeamProfilePage() {
  const { id } = useParams();
  const [team, setTeam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchTeam() {
      if (!id || Array.isArray(id)) return;
      
      try {
        // Here we'd ideally use a slug or name if 'id' is a string like 'phoenix-cysec'
        const { data, error } = await supabase
          .from('teams')
          .select('*')
          .filter('name', 'ilike', (id as string).replace('-', ' '))
          .single();
        
        if (error) throw error;
        setTeam(data);
      } catch (err) {
        console.error('Error fetching team:', err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchTeam();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-[#050816] text-white flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-black uppercase italic italic mb-4">Team Not Found</h1>
        <Link href="/scoreboard" className="esports-button">Back to Leaderboard</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white selection:bg-primary/30">
      <Navbar />

      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto space-y-12">
        <Link href="/scoreboard" className="inline-flex items-center gap-2 text-[10px] font-bold text-zinc-500 hover:text-primary transition-colors uppercase tracking-widest group">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Leaderboard
        </Link>

        {/* Profile Header */}
        <div className="glass-card p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 -mr-32 -mt-32 rounded-full blur-3xl" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div className="w-40 h-40 bg-white/5 border-2 border-primary flex items-center justify-center font-black italic text-6xl text-primary shadow-[0_0_50px_rgba(59,130,246,0.2)]">
              {team?.name?.[0] || '?'}
            </div>
            
            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest">Team Profile</span>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                  <Activity className="w-3 h-3" /> Active Since 2024
                </span>
              </div>
              <h1 className="text-6xl font-black tracking-tighter italic uppercase">{team.name}</h1>
              <p className="text-zinc-500 font-medium uppercase tracking-[0.2em] text-xs">Global Ranking: <span className="text-white">#01</span> • Division: <span className="text-primary italic">Elite Alpha</span></p>
            </div>

            <div className="grid grid-cols-2 gap-8 px-12 py-6 bg-white/5 border border-white/10">
              <div className="text-center">
                <div className="text-3xl font-black italic italic uppercase tracking-tighter">{(team.points || 0).toLocaleString()}</div>
                <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Aggregate Pts</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black italic italic uppercase tracking-tighter">{team.solves || 0}</div>
                <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Total Captures</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Stats & Medals */}
          <div className="space-y-8">
            <div className="glass-card p-8 space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-widest border-b border-white/5 pb-4">Achievements</h3>
              <div className="space-y-4">
                <AchievementItem icon={<Trophy className="text-amber-400" />} label="Gold Medals" value={team.gold || 0} />
                <AchievementItem icon={<Trophy className="text-zinc-400" />} label="Silver Medals" value={team.silver || 0} />
                <AchievementItem icon={<Trophy className="text-orange-600" />} label="Bronze Medals" value={team.bronze || 0} />
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass-card p-8">
              <h3 className="text-sm font-bold uppercase tracking-widest border-b border-white/5 pb-6 mb-6">Recent Captures</h3>
              <div className="space-y-4">
                {[].length > 0 ? (
                  // Activity Map
                  null
                ) : (
                  <div className="p-12 border border-dashed border-white/10 text-center opacity-30">
                    <Terminal className="w-8 h-8 mx-auto mb-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">No Recent Activity Recorded</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function AchievementItem({ icon, label, value }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5">
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{label}</span>
      </div>
      <span className="text-xl font-black italic">{value}</span>
    </div>
  );
}
