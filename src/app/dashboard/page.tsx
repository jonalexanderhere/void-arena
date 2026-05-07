'use client';

import { motion } from 'framer-motion';
import { Shield, Trophy, Zap, Users, Activity, Terminal, Star, Clock, Target, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#050816] text-white selection:bg-primary/30">
      {/* Sidebar / Nav would go here, using a simpler layout for now */}
      <div className="flex">
        {/* Simple Sidebar */}
        <aside className="w-64 min-h-screen border-r border-white/5 bg-[#0B1020]/50 backdrop-blur-xl hidden lg:block sticky top-0">
          <div className="p-6">
            <Link href="/" className="flex items-center gap-2 mb-12 group">
              <div className="w-8 h-8 bg-primary flex items-center justify-center rotate-45">
                <Shield className="w-5 h-5 -rotate-45" />
              </div>
              <span className="text-xl font-black tracking-tighter italic uppercase">VOID</span>
            </Link>

            <nav className="space-y-1">
              <SidebarLink href="/dashboard" icon={<Activity className="w-4 h-4" />} label="Overview" active />
              <SidebarLink href="/classic" icon={<Terminal className="w-4 h-4" />} label="Challenges" />
              <SidebarLink href="/arena" icon={<Zap className="w-4 h-4" />} label="Arena" />
              <SidebarLink href="/tournaments" icon={<Trophy className="w-4 h-4" />} label="Tournaments" />
              <SidebarLink href="/teams" icon={<Users className="w-4 h-4" />} label="My Team" />
              <SidebarLink href="/settings" icon={<Clock className="w-4 h-4" />} label="History" />
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-black tracking-tighter italic uppercase">Welcome Back, <span className="text-primary">PhoenixCySec</span></h1>
              <p className="text-zinc-500 font-medium">Your squad is currently ranked #01 in the Global Circuit.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">Current XP</div>
                <div className="h-2 w-48 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '75%' }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-primary to-indigo shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                  />
                </div>
              </div>
              <div className="w-12 h-12 rounded-none border border-primary/50 bg-primary/10 flex items-center justify-center text-primary font-black italic">
                LVL 42
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatCard label="Total Points" value="12,850" sub="+1,200 this week" icon={<Star className="text-amber-500" />} />
            <StatCard label="Capture Rate" value="94%" sub="Top 1% of players" icon={<Target className="text-emerald-500" />} />
            <StatCard label="Arena Rank" value="Diamond II" sub="240 RR to Elite" icon={<Zap className="text-primary" />} />
            <StatCard label="Matches" value="142" sub="86% Win rate" icon={<Activity className="text-indigo" />} />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Active Challenge */}
            <div className="xl:col-span-2 space-y-8">
              <div className="glass-card p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4">
                  <div className="text-[10px] font-bold text-primary flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    MATCH IN PROGRESS
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="w-full md:w-48 aspect-square bg-[#050816] border border-white/5 flex items-center justify-center relative overflow-hidden">
                    <Terminal className="w-16 h-16 text-zinc-800 group-hover:text-primary/20 transition-colors duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050816] to-transparent opacity-60" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="text-xs font-bold text-primary uppercase tracking-[0.2em]">Active Tournament: Regional Finals</div>
                    <h2 className="text-3xl font-black tracking-tight italic uppercase">Kernel Overload: Root Access</h2>
                    <p className="text-zinc-400 text-sm max-w-lg">
                      Analyze the provided firmware image and identify the stack overflow vulnerability in the custom serial driver.
                    </p>
                    <div className="flex flex-wrap gap-4 pt-2">
                      <div className="px-3 py-1 bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest">Pwn</div>
                      <div className="px-3 py-1 bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest">Insane</div>
                      <div className="px-3 py-1 bg-primary/20 border border-primary/30 text-[10px] font-bold uppercase tracking-widest text-primary">500 PTS</div>
                    </div>
                    <div className="pt-4 flex gap-4">
                      <button className="esports-button !py-2 !px-6 !text-xs">Resume Challenge</button>
                      <button className="esports-button-outline !py-2 !px-6 !text-xs">Submit Flag</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tournament Progress */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black tracking-widest uppercase italic italic flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-primary" /> Bracket Progress
                  </h3>
                  <Link href="/tournaments" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                    View All <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <MatchStatus team1="PHOENIX" team2="HYDRA" status="WON" score="3 - 1" current />
                  <MatchStatus team1="PHOENIX" team2="OMEGA" status="UPCOMING" score="VS" />
                  <MatchStatus team1="TBD" team2="TBD" status="LATER" score="-" />
                </div>
              </div>
            </div>

            {/* Sidebar Stats */}
            <div className="space-y-8">
              <div className="glass-card p-6">
                <h3 className="text-sm font-bold uppercase tracking-widest mb-6 text-zinc-500">Live Solve Feed</h3>
                <div className="space-y-4">
                  <FeedItem user="Raven_X" action="solved" target="SQL Injection II" time="2m ago" />
                  <FeedItem user="Ghost_One" action="captured" target="First Blood: Buffer" time="5m ago" highlight />
                  <FeedItem user="ZeroDay" action="solved" target="Crypto Vault" time="12m ago" />
                  <FeedItem user="Admin" action="announced" target="Round 2 Starting" time="15m ago" />
                </div>
              </div>

              <div className="glass-card p-6 border-primary/20 bg-primary/5">
                <h3 className="text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" /> Daily Mission
                </h3>
                <div className="space-y-4">
                  <p className="text-xs text-zinc-400">Solve 3 Web Exploitation challenges to earn a Bonus XP crate.</p>
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-zinc-500">PROGRESS</span>
                    <span>2 / 3</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[66%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarLink({ href, icon, label, active = false }: { href: string, icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest transition-all duration-300 border-r-2 ${
        active 
          ? 'bg-primary/10 text-primary border-primary' 
          : 'text-zinc-500 border-transparent hover:text-white hover:bg-white/5'
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}

function StatCard({ label, value, sub, icon }: { label: string, value: string, sub: string, icon: React.ReactNode }) {
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

function FeedItem({ user, action, target, time, highlight = false }: any) {
  return (
    <div className={`flex items-center gap-3 p-3 border border-white/5 ${highlight ? 'bg-primary/5 border-primary/20' : 'bg-white/5'}`}>
      <div className={`w-1 h-8 ${highlight ? 'bg-primary' : 'bg-zinc-800'}`} />
      <div className="flex-1 min-w-0">
        <div className="text-[11px] truncate">
          <span className={`font-bold italic ${highlight ? 'text-primary' : 'text-white'}`}>{user}</span>
          <span className="text-zinc-500"> {action} </span>
          <span className="font-bold text-white italic">{target}</span>
        </div>
        <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-tighter">{time}</div>
      </div>
    </div>
  );
}

function MatchStatus({ team1, team2, status, score, current = false }: any) {
  return (
    <div className={`p-4 border ${current ? 'bg-primary/10 border-primary/30' : 'bg-white/5 border-white/5'} flex flex-col items-center gap-2`}>
      <div className="flex items-center gap-4 text-xs font-black italic tracking-tighter">
        <span>{team1}</span>
        <span className="text-zinc-600">VS</span>
        <span>{team2}</span>
      </div>
      <div className="text-lg font-black italic text-primary">{score}</div>
      <div className={`text-[9px] font-bold uppercase tracking-widest ${status === 'WON' ? 'text-emerald-500' : 'text-zinc-600'}`}>
        {status}
      </div>
    </div>
  );
}
