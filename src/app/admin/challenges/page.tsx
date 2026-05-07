'use client';

import { motion } from 'framer-motion';
import { Shield, Terminal, Plus, Search, Filter, Edit, Trash2, LayoutDashboard, Trophy, Users, BarChart3, Activity, Settings } from 'lucide-react';
import Link from 'next/link';

export default function AdminChallenges() {
  return (
    <div className="min-h-screen bg-[#050816] text-white flex">
      {/* Shared Admin Sidebar */}
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
          <AdminLink href="/admin" icon={<LayoutDashboard className="w-4 h-4" />} label="Overview" />
          <AdminLink href="/admin/challenges" icon={<Terminal className="w-4 h-4" />} label="Challenges" active />
          <AdminLink href="/admin/tournaments" icon={<Trophy className="w-4 h-4" />} label="Tournaments" />
          <AdminLink href="/admin/teams" icon={<Users className="w-4 h-4" />} label="Teams" />
          <AdminLink href="/admin/players" icon={<Users className="w-4 h-4" />} label="Players" />
          <AdminLink href="/admin/stats" icon={<BarChart3 className="w-4 h-4" />} label="Analytics" />
          <AdminLink href="/admin/logs" icon={<Activity className="w-4 h-4" />} label="Audit Logs" />
          <AdminLink href="/admin/settings" icon={<Settings className="w-4 h-4" />} label="Settings" />
        </nav>
      </aside>

      <main className="flex-1 p-10 space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-black italic uppercase italic italic tracking-tight">Challenge Repository</h1>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Manage your library of 48 active challenges.</p>
          </div>
          <button className="esports-button flex items-center gap-2 !py-3 !px-8 !text-xs">
            <Plus className="w-4 h-4" /> Create Challenge
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-hover:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="SEARCH BY TITLE, TAG, OR ID..." 
              className="w-full bg-[#0B1020] border border-white/5 px-12 py-3 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>
          <button className="p-3 bg-[#0B1020] border border-white/5 hover:bg-white/5 transition-colors">
            <Filter className="w-4 h-4 text-zinc-500" />
          </button>
        </div>

        <div className="glass-card rounded-none overflow-hidden border-white/5">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-[10px] font-bold uppercase tracking-widest text-zinc-500 border-b border-white/5">
                <th className="px-8 py-6">ID</th>
                <th className="px-8 py-6">Title</th>
                <th className="px-8 py-6">Category</th>
                <th className="px-8 py-6">Difficulty</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { id: 'CH-001', title: 'Ghost Injection', category: 'Web', difficulty: 'Medium', status: 'Active' },
                { id: 'CH-002', title: 'Kernel Abyss', category: 'Pwn', difficulty: 'Hard', status: 'Active' },
                { id: 'CH-003', title: 'Vault 7', category: 'Crypto', difficulty: 'Easy', status: 'Archived' },
                { id: 'CH-004', title: 'Firmware X', category: 'Reverse', difficulty: 'Insane', status: 'Active' },
              ].map((chall, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-6 text-xs text-zinc-500 font-mono">{chall.id}</td>
                  <td className="px-8 py-6">
                    <div className="text-sm font-black italic uppercase italic italic tracking-tight">{chall.title}</div>
                  </td>
                  <td className="px-8 py-6 text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{chall.category}</td>
                  <td className="px-8 py-6">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${
                      chall.difficulty === 'Insane' ? 'text-rose-500' : 'text-primary'
                    }`}>{chall.difficulty}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className={`inline-flex items-center gap-2 px-2 py-1 text-[9px] font-bold uppercase tracking-widest ${
                      chall.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-800 text-zinc-500'
                    }`}>
                      <div className={`w-1 h-1 rounded-full ${chall.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-600'}`} />
                      {chall.status}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-white/10 transition-colors"><Edit className="w-4 h-4 text-zinc-500" /></button>
                      <button className="p-2 hover:bg-rose-500/20 transition-colors"><Trash2 className="w-4 h-4 text-rose-500" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
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
