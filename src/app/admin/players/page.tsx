'use client';

import { AdminSidebar } from "@/components/admin/Sidebar";
import { Users, Search, Filter, Shield, Star, Activity, UserCog } from "lucide-react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';

export default function AdminPlayers() {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const supabase = createClientComponentClient();

  async function fetchPlayers() {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('points', { ascending: false });
    
    if (!error) setPlayers(data || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchPlayers();
  }, []);

  const filteredPlayers = players.filter(p => 
    p.username?.toLowerCase().includes(search.toLowerCase()) ||
    p.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050816] text-white flex">
      <AdminSidebar />
      <main className="flex-1 p-10 space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-black italic uppercase italic tracking-tight">Recruit Directory</h1>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Manage platform players and permissions.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 border-white/5">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Active Recruits</span>
              <Users className="text-primary w-4 h-4" />
            </div>
            <div className="text-3xl font-black italic uppercase tracking-tighter">{players.length}</div>
          </div>
          <div className="glass-card p-6 border-white/5">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Avg Intelligence</span>
              <Star className="text-amber-500 w-4 h-4" />
            </div>
            <div className="text-3xl font-black italic uppercase tracking-tighter">LVL {Math.floor(players.reduce((acc, curr) => acc + (curr.level || 1), 0) / (players.length || 1))}</div>
          </div>
          <div className="glass-card p-6 border-white/5">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Admins</span>
              <Shield className="text-primary w-4 h-4" />
            </div>
            <div className="text-3xl font-black italic uppercase tracking-tighter">{players.filter(p => p.role === 'admin').length}</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-hover:text-primary transition-colors" />
            <input 
              type="text" 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="SEARCH BY USERNAME OR FULL NAME..." 
              className="w-full bg-[#0B1020] border border-white/5 px-12 py-3 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>
        </div>

        <div className="glass-card rounded-none overflow-hidden border-white/5">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-[10px] font-bold uppercase tracking-widest text-zinc-500 border-b border-white/5">
                <th className="px-8 py-6">Recruit</th>
                <th className="px-8 py-6">Role</th>
                <th className="px-8 py-6">XP / Points</th>
                <th className="px-8 py-6">Level</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr className="bg-white/5">
                  <td colSpan={5} className="px-8 py-20 text-center text-zinc-600 font-bold uppercase text-[10px] tracking-widest animate-pulse">
                    Accessing Central Intelligence...
                  </td>
                </tr>
              ) : filteredPlayers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-zinc-600 font-bold uppercase text-[10px] tracking-widest">
                    No recruits identified.
                  </td>
                </tr>
              ) : (
                filteredPlayers.map((p) => (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black italic text-xs">
                          {p.username?.[0] || '?'}
                        </div>
                        <div>
                          <p className="font-bold italic uppercase tracking-tight text-white">{p.username || 'Anonymous'}</p>
                          <p className="text-[9px] text-zinc-500 font-medium uppercase tracking-widest">{p.full_name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-2 py-1 text-[9px] font-black uppercase tracking-widest ${
                        p.role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-zinc-800 text-zinc-500'
                      }`}>
                        {p.role}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-xs font-black italic text-zinc-300">{p.points?.toLocaleString()} XP</td>
                    <td className="px-8 py-5 text-xs font-bold text-white">LVL {p.level || 1}</td>
                    <td className="px-8 py-5 text-right">
                      <button className="p-2 hover:text-primary transition-colors">
                        <UserCog className="w-4 h-4" />
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
