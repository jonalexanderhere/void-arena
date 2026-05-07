'use client';

import { AdminSidebar } from "@/components/admin/Sidebar";
import { Plus, Trophy, Search, Filter, Edit, MoreVertical, Calendar, Users, Zap, Globe, Shield, Save, X } from "lucide-react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminTournaments() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    status: 'Upcoming',
    date: '',
    prize: '',
    region: 'GLOBAL',
    description: '',
    teams: 0
  });
  
  const supabase = createClientComponentClient();

  async function fetchTournaments() {
    setLoading(true);
    const { data, error } = await supabase
      .from('tournaments')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error) setTournaments(data || []);
    setLoading(false);
  }

  useEffect(() => {
    async function checkAdmin() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/login';
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'admin') {
        window.location.href = '/dashboard';
        return;
      }
      
      fetchTournaments();
    }
    checkAdmin();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase
      .from('tournaments')
      .insert([formData]);

    if (!error) {
      setShowCreateModal(false);
      fetchTournaments();
      setFormData({ name: '', status: 'Upcoming', date: '', prize: '', region: 'GLOBAL', description: '', teams: 0 });
    } else {
      alert('Error creating tournament: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white flex">
      <AdminSidebar />
      <main className="flex-1 p-10 space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-black italic uppercase italic tracking-tight">Tournament Control</h1>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Manage circuit events, brackets, and participant settings.</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="esports-button flex items-center gap-2 !py-3 !px-8 !text-xs"
          >
            <Plus className="w-4 h-4" /> Create New Circuit
          </button>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatusCard label="Active Circuits" value="04" icon={<Activity className="text-primary" />} />
          <StatusCard label="Pending Approval" value="12" icon={<Clock className="text-amber-500" />} />
          <StatusCard label="Total Prize Pool" value="$145k" icon={<Zap className="text-indigo" />} />
          <StatusCard label="Global Players" value="2.4k" icon={<Users className="text-primary" />} />
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-hover:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="SEARCH CIRCUITS..." 
              className="w-full bg-[#0B1020] border border-white/5 px-12 py-3 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>
          <button className="p-3 bg-[#0B1020] border border-white/5 hover:bg-white/5 transition-colors">
            <Filter className="w-4 h-4 text-zinc-500" />
          </button>
        </div>

        {/* Tournament Table */}
        <div className="glass-card rounded-none overflow-hidden border-white/5">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-[10px] font-bold uppercase tracking-widest text-zinc-500 border-b border-white/5">
                <th className="px-8 py-6">Circuit Name</th>
                <th className="px-8 py-6">Mode</th>
                <th className="px-8 py-6">Type</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6">Participants</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr className="bg-white/5">
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Trophy className="w-12 h-12 text-zinc-700 animate-pulse" />
                      <div className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600">Retrieving Circuit Data...</div>
                    </div>
                  </td>
                </tr>
              ) : tournaments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-zinc-600 font-bold uppercase text-[10px] tracking-widest">
                    No active circuits found in database.
                  </td>
                </tr>
              ) : (
                tournaments.map((t) => (
                  <tr key={t.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black italic text-xs">
                          {t.name[0]}
                        </div>
                        <span className="font-bold italic uppercase tracking-tight text-white">{t.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">CLASSIC CTF</td>
                    <td className="px-8 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t.region}</td>
                    <td className="px-8 py-5">
                      <span className={`px-2 py-1 text-[9px] font-black uppercase tracking-widest ${
                        t.status === 'Live' ? 'bg-emerald-500/20 text-emerald-500' : 
                        t.status === 'Upcoming' ? 'bg-amber-500/20 text-amber-500' : 'bg-zinc-800 text-zinc-500'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-[10px] font-bold text-white uppercase tracking-widest">{t.teams} SQUADS</td>
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

        {/* Create Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowCreateModal(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative glass-card w-full max-w-2xl overflow-hidden bg-[#0B1020]"
              >
                <div className="p-8 border-b border-white/5 flex justify-between items-center bg-[#050816]">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 text-primary border border-primary/20">
                      <Trophy className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black italic uppercase italic tracking-tight">Create New Circuit</h2>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Configure event parameters and logic.</p>
                    </div>
                  </div>
                  <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-white/5 transition-colors">
                    <X className="w-6 h-6 text-zinc-500" />
                  </button>
                </div>

                <form onSubmit={handleCreate} className="p-8 grid grid-cols-2 gap-6">
                  <div className="col-span-2 space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Tournament Name</label>
                    <input 
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-[#050816] border border-white/5 px-6 py-3 text-xs font-bold uppercase tracking-widest focus:border-primary transition-all" 
                      placeholder="E.G. GLOBAL INVITATIONAL 2026" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Region / Scope</label>
                    <input 
                      value={formData.region}
                      onChange={e => setFormData({...formData, region: e.target.value})}
                      className="w-full bg-[#050816] border border-white/5 px-6 py-3 text-xs font-bold uppercase tracking-widest focus:border-primary transition-all" 
                      placeholder="APAC / GLOBAL" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Status</label>
                    <select 
                      value={formData.status}
                      onChange={e => setFormData({...formData, status: e.target.value})}
                      className="w-full bg-[#050816] border border-white/5 px-6 py-3 text-xs font-bold uppercase tracking-widest focus:border-primary transition-all outline-none"
                    >
                      <option value="Upcoming">UPCOMING</option>
                      <option value="Live">LIVE</option>
                      <option value="Completed">COMPLETED</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Total Teams Limit</label>
                    <input 
                      type="number" 
                      value={formData.teams}
                      onChange={e => setFormData({...formData, teams: parseInt(e.target.value)})}
                      className="w-full bg-[#050816] border border-white/5 px-6 py-3 text-xs font-bold uppercase tracking-widest focus:border-primary transition-all" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Prize Pool</label>
                    <input 
                      value={formData.prize}
                      onChange={e => setFormData({...formData, prize: e.target.value})}
                      className="w-full bg-[#050816] border border-white/5 px-6 py-3 text-xs font-bold uppercase tracking-widest focus:border-primary transition-all" 
                      placeholder="50,000 USD" 
                    />
                  </div>

                  <div className="col-span-2 space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Date / Time Info</label>
                    <input 
                      value={formData.date}
                      onChange={e => setFormData({...formData, date: e.target.value})}
                      className="w-full bg-[#050816] border border-white/5 px-6 py-3 text-xs font-bold uppercase tracking-widest focus:border-primary transition-all" 
                      placeholder="JUNE 02, 2026 • 18:00 UTC" 
                    />
                  </div>

                  <div className="col-span-2 pt-6">
                    <button type="submit" className="esports-button w-full flex items-center justify-center gap-2 !py-4">
                      <Save className="w-5 h-5" /> Initialize Circuit
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function StatusCard({ label, value, icon }: any) {
  return (
    <div className="glass-card p-6 flex flex-col justify-between border-white/5">
      <div className="flex justify-between items-start mb-4">
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{label}</span>
        {icon}
      </div>
      <div className="text-3xl font-black italic italic italic uppercase tracking-tighter">{value}</div>
    </div>
  );
}

function Activity({ className }: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
  );
}

function Clock({ className }: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
  );
}
