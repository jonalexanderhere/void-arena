'use client';

import { useEffect, useState } from 'react';
import { Activity, Clock, ExternalLink, Shield, Star, Terminal, Trophy, Users, Zap, LogOut } from 'lucide-react';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

type DashboardData = {
  profile: { username: string; avatar_url: string | null; bio: string; level: number; progress: number };
  stats: { total_points: number; total_solves: number; total_challenges: number };
  feed: Array<{ id: string; actor: string; action: string; target: string; points_delta: number; created_at: string }>;
  matches: Array<{ id: string; team_a: string; team_b: string; status: string; score: string; created_at: string }>;
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState('');
  const supabase = createClientComponentClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  useEffect(() => {
    const run = async () => {
      const res = await fetch('/api/dashboard');
      const json = await res.json();
      if (!res.ok) {
        setError(json?.error ?? 'Failed to load dashboard data.');
        return;
      }
      setData(json);
    };
    run();
  }, []);

  return (
    <div className="min-h-screen bg-[#050816] text-white selection:bg-primary/30">
      <div className="flex">
        <aside className="w-64 min-h-screen border-r border-white/5 bg-[#0B1020]/50 backdrop-blur-xl hidden lg:flex flex-col sticky top-0">
          <div className="p-6 flex-1">
            <Link href="/" className="flex items-center gap-2 mb-12 group">
              <div className="w-8 h-8 bg-primary flex items-center justify-center rotate-45"><Shield className="w-5 h-5 -rotate-45" /></div>
              <span className="text-xl font-black tracking-tighter italic uppercase">VOID</span>
            </Link>
            <nav className="space-y-1">
              <SidebarLink href="/dashboard" icon={<Activity className="w-4 h-4" />} label="Overview" active />
              <SidebarLink href="/classic" icon={<Terminal className="w-4 h-4" />} label="Challenges" />
              <SidebarLink href="/arena" icon={<Zap className="w-4 h-4" />} label="Arena" />
              <SidebarLink href="/tournaments" icon={<Trophy className="w-4 h-4" />} label="Tournaments" />
              <SidebarLink href="/teams" icon={<Users className="w-4 h-4" />} label="My Team" />
              <SidebarLink href="/settings" icon={<Clock className="w-4 h-4" />} label="Settings" />
            </nav>
          </div>
          
          <div className="p-4 border-t border-white/5">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500/10 transition-all group"
            >
              <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              Sign Out
            </button>
          </div>
        </aside>

        <main className="flex-1 p-6 lg:p-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-black tracking-tighter italic uppercase">
                Welcome Back, <span className="text-primary">{data?.profile.username ?? 'LOADING'}</span>
              </h1>
              <p className="text-zinc-500 font-medium">{data?.profile.bio ?? 'Reading your profile...'}</p>
              {error ? <p className="text-rose-400 text-xs font-bold uppercase tracking-widest mt-2">{error}</p> : null}
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">Current XP</div>
                <div className="h-2 w-48 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-gradient-to-r from-primary to-indigo shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: `${Math.max(0, Math.min(100, data?.profile.progress ?? 0))}%` }} />
                </div>
              </div>
              <div className="w-12 h-12 rounded-none border border-primary/50 bg-primary/10 flex items-center justify-center text-primary font-black italic">
                LVL {data?.profile.level ?? 1}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatCard label="Total Points" value={String(data?.stats.total_points ?? 0)} sub="From activity feed" icon={<Star className="text-amber-500" />} />
            <StatCard label="Solved" value={String(data?.stats.total_solves ?? 0)} sub="Correct submissions" icon={<Terminal className="text-emerald-500" />} />
            <StatCard label="Challenges" value={String(data?.stats.total_challenges ?? 0)} sub="Available in pool" icon={<Zap className="text-primary" />} />
            <StatCard label="Match Log" value={String(data?.matches.length ?? 0)} sub="Recent results" icon={<Activity className="text-indigo" />} />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-8">
              <div className="glass-card p-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-black tracking-tight italic uppercase">Live Arena Access</h2>
                  <Link href="/arena" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">Open <ExternalLink className="w-3 h-3" /></Link>
                </div>
                <p className="text-zinc-400 text-sm">Dashboard sekarang mengambil data real dari Supabase, tanpa user demo hardcoded.</p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black tracking-widest uppercase italic flex items-center gap-2"><Trophy className="w-5 h-5 text-primary" /> Bracket Progress</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(data?.matches.length ? data.matches : [{ id: 'empty', team_a: 'TBD', team_b: 'TBD', status: 'NO MATCH', score: '-', created_at: '' }]).map((m) => (
                    <MatchStatus key={m.id} team1={m.team_a} team2={m.team_b} status={m.status} score={m.score} />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="glass-card p-6">
                <h3 className="text-sm font-bold uppercase tracking-widest mb-6 text-zinc-500">Live Solve Feed</h3>
                <div className="space-y-4">
                  {(data?.feed.length ? data.feed : [{ id: 'empty', actor: 'SYSTEM', action: 'waiting', target: 'No activity yet', points_delta: 0, created_at: '' }]).map((f) => (
                    <FeedItem key={f.id} user={f.actor} action={f.action} target={f.target} points={f.points_delta} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarLink({ href, icon, label, active = false }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <Link href={href} className={`flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest transition-all duration-300 border-r-2 ${active ? 'bg-primary/10 text-primary border-primary' : 'text-zinc-500 border-transparent hover:text-white hover:bg-white/5'}`}>
      {icon}
      {label}
    </Link>
  );
}

function StatCard({ label, value, sub, icon }: { label: string; value: string; sub: string; icon: React.ReactNode }) {
  return (
    <div className="glass-card p-6 group">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{label}</span>
        <div className="p-2 bg-white/5 group-hover:scale-110 transition-transform">{icon}</div>
      </div>
      <div className="text-3xl font-black tracking-tighter italic uppercase mb-1">{value}</div>
      <div className="text-[10px] font-medium text-zinc-500 uppercase tracking-wide">{sub}</div>
    </div>
  );
}

function FeedItem({ user, action, target, points }: { user: string; action: string; target: string; points: number }) {
  return (
    <div className="flex items-center gap-3 p-3 border border-white/5 bg-white/5">
      <div className="w-1 h-8 bg-zinc-800" />
      <div className="flex-1 min-w-0">
        <div className="text-[11px] truncate"><span className="font-bold italic text-white">{user}</span><span className="text-zinc-500"> {action} </span><span className="font-bold text-white italic">{target}</span></div>
        <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-tighter">{points ? `${points > 0 ? '+' : ''}${points} pts` : '0 pts'}</div>
      </div>
    </div>
  );
}

function MatchStatus({ team1, team2, status, score }: { team1: string; team2: string; status: string; score: string }) {
  return (
    <div className="p-4 border bg-white/5 border-white/5 flex flex-col items-center gap-2">
      <div className="flex items-center gap-4 text-xs font-black italic tracking-tighter">
        <span>{team1}</span><span className="text-zinc-600">VS</span><span>{team2}</span>
      </div>
      <div className="text-lg font-black italic text-primary">{score}</div>
      <div className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">{status}</div>
    </div>
  );
}
