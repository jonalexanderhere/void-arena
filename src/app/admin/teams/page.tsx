'use client';

import { AdminSidebar } from "@/components/admin/Sidebar";
import { Users, Search, Filter, Shield, Trophy, Activity, Edit } from "lucide-react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';

export default function AdminTeams() {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const supabase = createClientComponentClient();

  async function fetchTeams() {
    setLoading(true);
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('points', { ascending: false });
    
    if (!error) setTeams(data || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchTeams();
  }, []);

  const filteredTeams = teams.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.join_code?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050816] text-white flex">
      <AdminSidebar />
      <main className="flex-1 p-10 space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-black italic uppercase italic tracking-tight">Squad Management</h1>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Review and manage all registered teams.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 border-white/5">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total Squads</span>
              <Users className="text-primary w-4 h-4" />
            </div>
            <div className="text-3xl font-black italic uppercase tracking-tighter">{teams.length}</div>
          </div>
          <div className="glass-card p-6 border-white/5">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Global Points</span>
              <Trophy className="text-amber-500 w-4 h-4" />
            </div>
            <div className="text-3xl font-black italic uppercase tracking-tighter">{teams.reduce((acc, curr) => acc + (curr.points || 0), 0).toLocaleString()}</div>
          </div>
          <div className="glass-card p-6 border-white/5">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Recruiting</span>
              <Activity className="text-emerald-500 w-4 h-4" />
            </div>
            <div className="text-3xl font-black italic uppercase tracking-tighter">{teams.filter(t => t.status === 'Recruiting').length}</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-hover:text-primary transition-colors" />
            <input 
              type="text" 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="SEARCH BY SQUAD NAME OR INVITE CODE..." 
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
                <th className="px-8 py-6">Squad Name</th>
                <th className="px-8 py-6">Invite Code</th>
                <th className="px-8 py-6">Points</th>
                <th className="px-8 py-6">Wins</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr className="bg-white/5">
                  <td colSpan={6} className="px-8 py-20 text-center text-zinc-600 font-bold uppercase text-[10px] tracking-widest animate-pulse">
                    Scanning Neural Database...
                  </td>
                </tr>
              ) : filteredTeams.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-zinc-600 font-bold uppercase text-[10px] tracking-widest">
                    No active squads found.
                  </td>
                </tr>
              ) : (
                filteredTeams.map((t) => (
                  <tr key={t.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/5 border border-white/10 flex items-center justify-center text-primary font-black italic text-xs">
                          {t.name[0]}
                        </div>
                        <span className="font-bold italic uppercase tracking-tight text-white">{t.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 font-mono text-[11px] text-zinc-400 uppercase tracking-widest">{t.join_code}</td>
                    <td className="px-8 py-5 text-xs font-black italic text-primary">{t.points?.toLocaleString()}</td>
                    <td className="px-8 py-5 text-xs font-bold text-white">{t.wins}</td>
                    <td className="px-8 py-5">
                      <span className={`px-2 py-1 text-[9px] font-black uppercase tracking-widest ${
                        t.status === 'Recruiting' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-zinc-800 text-zinc-500'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="p-2 hover:text-primary transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
