'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, Trophy, Zap, Activity, Terminal, Star, Clock, Target, ExternalLink, Globe, Twitter, Github } from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';

export default function ProfilePage() {
  const { username } = useParams();

  return (
    <div className="min-h-screen bg-[#050816] text-white selection:bg-primary/30">
      <Navbar />

      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto space-y-12">
        {/* Profile Header */}
        <div className="glass-card p-12 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Shield className="w-64 h-64 text-white rotate-12" />
          </div>
          
          <div className="w-48 h-48 bg-[#050816] border-4 border-primary flex items-center justify-center font-black italic text-8xl text-primary shadow-[0_0_50px_rgba(59,130,246,0.3)] relative z-10">
            {username?.[0].toUpperCase()}
          </div>

          <div className="flex-1 space-y-6 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary">Elite Class</span>
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Global Rank #42</span>
              </div>
              <h1 className="text-6xl font-black tracking-tighter italic uppercase">{username}</h1>
              <p className="text-zinc-400 font-medium max-w-lg uppercase tracking-widest text-xs">Full-stack security researcher & Competitive CTF Player. Specialized in Kernel and Web exploitation.</p>
            </div>

            <div className="flex gap-4">
              <Link href="#" className="p-2 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"><Github className="w-4 h-4" /></Link>
              <Link href="#" className="p-2 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"><Twitter className="w-4 h-4" /></Link>
              <Link href="#" className="p-2 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"><Globe className="w-4 h-4" /></Link>
            </div>
          </div>

          <div className="w-full md:w-64 space-y-6 relative z-10">
            <div className="p-6 bg-primary/10 border border-primary/20 flex flex-col items-center text-center space-y-2">
              <div className="text-[10px] font-bold text-primary uppercase tracking-widest">Affiliation</div>
              <div className="text-xl font-black italic uppercase italic">PHOENIX CYSEC</div>
              <Link href="/teams/phoenix-cysec" className="text-[9px] font-black text-zinc-500 hover:text-white transition-colors uppercase tracking-widest">View Team Profile</Link>
            </div>
            <button className="w-full esports-button !py-3 !text-[10px]">Invite to Match</button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard label="Total Solves" value="1,242" sub="Top 0.1% Globally" icon={<Terminal />} />
          <StatCard label="Arena Victories" value="86" sub="Win Rate: 74%" icon={<Zap />} />
          <StatCard label="Achievements" value="12" sub="Elite Badges" icon={<Trophy />} />
          <StatCard label="Reputation" value="2.8k" sub="Community Trust" icon={<Star />} />
        </div>

        {/* Detailed Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <section className="space-y-6">
              <h2 className="text-2xl font-black italic uppercase italic italic tracking-tight border-b border-white/5 pb-4">Specializations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SpecProgress label="Web Exploitation" progress={95} />
                <SpecProgress label="Reverse Engineering" progress={82} />
                <SpecProgress label="Pwn / Binary" progress={88} />
                <SpecProgress label="Cryptography" progress={65} />
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-black italic uppercase italic italic tracking-tight border-b border-white/5 pb-4">Recent Combat Activity</h2>
              <div className="space-y-4">
                <ActivityItem title="Captured First Blood: Kernel Abyss" time="2h ago" points="+500" />
                <ActivityItem title="Won Arena Match vs RAVEN_SEC" time="5h ago" points="+150" />
                <ActivityItem title="Solved Ghost Injection" time="1d ago" points="+350" />
                <ActivityItem title="Completed APAC Regional Finals" time="2d ago" points="+1200" />
              </div>
            </section>
          </div>

          <aside className="space-y-12">
            <section className="space-y-6">
              <h2 className="text-xl font-black italic uppercase italic italic tracking-tight border-b border-white/5 pb-4">Hall of Fame</h2>
              <div className="grid grid-cols-2 gap-4">
                <Badge icon={<Trophy className="text-amber-500" />} label="APAC Finalist" />
                <Badge icon={<Zap className="text-primary" />} label="Speedster" />
                <Badge icon={<Shield className="text-indigo" />} label="Defender" />
                <Badge icon={<Star className="text-rose-500" />} label="Top Solver" />
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-xl font-black italic uppercase italic italic tracking-tight border-b border-white/5 pb-4">Skill Matrix</h2>
              <div className="aspect-square glass-card p-6 flex items-center justify-center border-dashed border-white/10 text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
                Radar Chart Visualization
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, sub, icon }: any) {
  return (
    <div className="glass-card p-8 group">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{label}</span>
        <div className="p-2 bg-white/5 group-hover:scale-110 transition-transform text-primary">{icon}</div>
      </div>
      <div className="text-3xl font-black italic italic italic uppercase tracking-tighter mb-1">{value}</div>
      <div className="text-[10px] font-medium text-zinc-600 uppercase tracking-wide">{sub}</div>
    </div>
  );
}

function SpecProgress({ label, progress }: any) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
        <span>{label}</span>
        <span className="text-primary">{progress}%</span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, delay: 0.5 }}
          className="h-full bg-gradient-to-r from-primary to-indigo shadow-[0_0_10px_rgba(59,130,246,0.3)]" 
        />
      </div>
    </div>
  );
}

function ActivityItem({ title, time, points }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
      <div className="flex items-center gap-4">
        <div className="w-1 h-8 bg-primary" />
        <div>
          <div className="text-sm font-bold text-white uppercase italic">{title}</div>
          <div className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">{time}</div>
        </div>
      </div>
      <div className="text-primary font-black italic">{points}</div>
    </div>
  );
}

function Badge({ icon, label }: any) {
  return (
    <div className="flex flex-col items-center gap-2 p-4 bg-[#0B1020] border border-white/5 hover:border-white/20 transition-all text-center">
      <div className="p-3 bg-white/5 rounded-full">{icon}</div>
      <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">{label}</span>
    </div>
  );
}
