'use client';

import { motion } from 'framer-motion';
import { 
  Shield, LayoutDashboard, Terminal, Trophy, Users, Settings, 
  Plus, Search, Filter, MoreVertical, Edit, Trash2, 
  BarChart3, Activity, Bell, ExternalLink 
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-[#050816] text-white selection:bg-primary/30">
      <div className="flex">
        {/* Admin Sidebar */}
        <aside className="w-64 min-h-screen border-r border-white/5 bg-[#0B1020]/80 backdrop-blur-xl sticky top-0">
          <div className="p-6 border-b border-white/5">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-primary flex items-center justify-center rotate-45">
                <Shield className="w-5 h-5 -rotate-45" />
              </div>
              <span className="text-xl font-black tracking-tighter italic uppercase">VOID <span className="text-zinc-500">ADMIN</span></span>
            </Link>
          </div>

          <nav className="p-4 space-y-1">
            <AdminLink href="/admin" icon={<LayoutDashboard className="w-4 h-4" />} label="Overview" active />
            <AdminLink href="/admin/challenges" icon={<Terminal className="w-4 h-4" />} label="Challenges" />
            <AdminLink href="/admin/tournaments" icon={<Trophy className="w-4 h-4" />} label="Tournaments" />
            <AdminLink href="/admin/teams" icon={<Users className="w-4 h-4" />} label="Teams" />
            <AdminLink href="/admin/players" icon={<Users className="w-4 h-4" />} label="Players" />
            <div className="pt-4 pb-2 px-4">
              <h4 className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Platform</h4>
            </div>
            <AdminLink href="/admin/stats" icon={<BarChart3 className="w-4 h-4" />} label="Analytics" />
            <AdminLink href="/admin/logs" icon={<Activity className="w-4 h-4" />} label="Audit Logs" />
            <AdminLink href="/admin/settings" icon={<Settings className="w-4 h-4" />} label="Settings" />
          </nav>
        </aside>

        {/* Admin Main Content */}
        <main className="flex-1">
          {/* Header */}
          <header className="h-20 border-b border-white/5 bg-[#0B1020]/30 flex items-center justify-between px-10">
            <div className="flex items-center gap-4">
              <h2 className="text-sm font-bold uppercase tracking-widest">System Overview</h2>
              <div className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-500 rounded uppercase">All Systems Nominal</div>
            </div>
            <div className="flex items-center gap-6">
              <button className="relative p-2 hover:bg-white/5 transition-colors">
                <Bell className="w-5 h-5 text-zinc-500" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#0B1020]" />
              </button>
              <div className="h-8 w-[1px] bg-white/5" />
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs font-bold italic uppercase">Admin User</div>
                  <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Super Admin</div>
                </div>
                <div className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center font-black italic">A</div>
              </div>
            </div>
          </header>

          <div className="p-10 space-y-10">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <QuickStat label="Active Challenges" value="48" trend="+4 new" />
              <QuickStat label="Live Tournaments" value="3" trend="1 ending soon" />
              <QuickStat label="Total Solves" value="1,242" trend="+124 today" />
              <QuickStat label="Reports" value="0" trend="Clear" success />
            </div>

            {/* Management Sections */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
              {/* Recent Challenges */}
              <div className="glass-card rounded-none overflow-hidden">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-widest">Recent Challenges</h3>
                  <button className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase tracking-widest hover:bg-primary/20 transition-all">
                    <Plus className="w-3 h-3" /> New Challenge
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-white/5 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                        <th className="px-6 py-4">Title</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Difficulty</th>
                        <th className="px-6 py-4">Solves</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {[
                        { title: 'Ghost Injection', category: 'Web', difficulty: 'Medium', solves: 12 },
                        { title: 'Kernel Abyss', category: 'Pwn', difficulty: 'Hard', solves: 3 },
                        { title: 'Vault 7', category: 'Crypto', difficulty: 'Easy', solves: 45 },
                        { title: 'Firmware X', category: 'Reverse', difficulty: 'Insane', solves: 1 },
                      ].map((chall, i) => (
                        <tr key={i} className="hover:bg-white/5 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="text-xs font-bold italic uppercase">{chall.title}</div>
                          </td>
                          <td className="px-6 py-4 text-xs text-zinc-500 uppercase font-medium">{chall.category}</td>
                          <td className="px-6 py-4 text-xs font-bold uppercase italic">{chall.difficulty}</td>
                          <td className="px-6 py-4 text-xs text-zinc-500 font-mono">{chall.solves}</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-2 hover:bg-white/10 transition-colors"><Edit className="w-3.5 h-3.5 text-zinc-500" /></button>
                              <button className="p-2 hover:bg-rose-500/20 transition-colors"><Trash2 className="w-3.5 h-3.5 text-rose-500" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 border-t border-white/5 text-center">
                  <Link href="/admin/challenges" className="text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-colors">View All Challenges</Link>
                </div>
              </div>

              {/* Tournament Control */}
              <div className="glass-card rounded-none overflow-hidden">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-widest">Active Tournaments</h3>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-[10px] font-bold text-white uppercase tracking-widest hover:bg-white/10 transition-all">
                    <Trophy className="w-3 h-3" /> All Events
                  </button>
                </div>
                <div className="p-6 space-y-6">
                  {[
                    { name: 'APAC Regional Finals', type: 'Swiss', status: 'Live', progress: 75 },
                    { name: 'Global Invitational', type: 'Elimination', status: 'Draft', progress: 0 },
                    { name: 'Rookie Cup #42', type: 'Round Robin', status: 'Upcoming', progress: 100 },
                  ].map((event, i) => (
                    <div key={i} className="p-4 border border-white/5 bg-white/5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-black italic uppercase italic italic">{event.name}</div>
                          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{event.type}</div>
                        </div>
                        <div className={`px-2 py-1 text-[9px] font-bold uppercase tracking-widest ${
                          event.status === 'Live' ? 'bg-primary/20 text-primary animate-pulse' : 'bg-zinc-800 text-zinc-400'
                        }`}>
                          {event.status}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[9px] font-bold uppercase text-zinc-500">
                          <span>Progress</span>
                          <span>{event.progress}%</span>
                        </div>
                        <div className="h-1 w-full bg-white/5 overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${event.progress}%` }} />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 py-2 bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase tracking-widest hover:bg-primary/20 transition-all">Manage Rounds</button>
                        <button className="py-2 px-3 border border-white/10 hover:bg-white/5 transition-all"><Settings className="w-3 h-3 text-zinc-500" /></button>
                      </div>
                    </div>
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

function AdminLink({ href, icon, label, active = false }: any) {
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
        active 
          ? 'bg-primary text-white italic italic italic rounded-none' 
          : 'text-zinc-500 hover:text-white hover:bg-white/5'
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}

function QuickStat({ label, value, trend, success = false }: any) {
  return (
    <div className="glass-card p-6">
      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">{label}</div>
      <div className="text-3xl font-black italic italic italic uppercase tracking-tighter mb-1">{value}</div>
      <div className={`text-[10px] font-bold uppercase tracking-widest ${success ? 'text-emerald-500' : 'text-primary'}`}>{trend}</div>
    </div>
  );
}
