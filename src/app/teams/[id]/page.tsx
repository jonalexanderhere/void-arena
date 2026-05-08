'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Trophy, Users, Star, Activity, Terminal, ChevronLeft, Settings, Save, X, Github, Globe, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Navbar } from '@/components/layout/Navbar';

export default function TeamProfilePage() {
  const { id } = useParams();
  const [team, setTeam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCaptain, setIsCaptain] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    logo_url: '',
    banner_url: '',
    description: '',
    social_links: {
      github: '',
      website: '',
      discord: ''
    }
  });

  const supabase = createClientComponentClient();

  async function fetchTeam() {
    if (!id || Array.isArray(id)) return;
    
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .filter('name', 'ilike', (id as string).replace(/-/g, ' '))
        .single();
      
      if (error) throw error;
      setTeam(data);
      setFormData({
        logo_url: data.logo_url || '',
        banner_url: data.banner_url || '',
        description: data.description || '',
        social_links: {
          github: data.social_links?.github || '',
          website: data.social_links?.website || '',
          discord: data.social_links?.discord || ''
        }
      });

      const { data: { user } } = await supabase.auth.getUser();
      if (user && data.captain_id === user.id) {
        setIsCaptain(true);
      }
    } catch (err) {
      console.error('Error fetching team:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) fetchTeam();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase
      .from('teams')
      .update({
        logo_url: formData.logo_url,
        banner_url: formData.banner_url,
        description: formData.description,
        social_links: formData.social_links
      })
      .eq('id', team.id);

    if (!error) {
      setShowSettings(false);
      fetchTeam();
    } else {
      alert('Error updating team: ' + error.message);
    }
    setSaving(false);
  };

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
        <h1 className="text-2xl font-black uppercase italic mb-4">Team Not Found</h1>
        <Link href="/scoreboard" className="esports-button">Back to Leaderboard</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white selection:bg-primary/30">
      <Navbar />

      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto space-y-12">
        <div className="flex justify-between items-center">
          <Link href="/scoreboard" className="inline-flex items-center gap-2 text-[10px] font-bold text-zinc-500 hover:text-primary transition-colors uppercase tracking-widest group">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Leaderboard
          </Link>
          {isCaptain && (
            <button 
              onClick={() => setShowSettings(true)}
              className="esports-button flex items-center gap-2 !py-2 !px-4 !text-[10px]"
            >
              <Settings className="w-4 h-4" /> Team Settings
            </button>
          )}
        </div>

        {/* Profile Header */}
        <div className="glass-card relative overflow-hidden">
          {/* Banner */}
          <div className="h-48 w-full bg-[#0B1020] border-b border-white/5 relative overflow-hidden">
            {team.banner_url ? (
              <img src={team.banner_url} className="w-full h-full object-cover opacity-40" alt="Banner" />
            ) : (
              <div className="absolute inset-0 bg-primary/5 opacity-20" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050816] to-transparent" />
          </div>
          
          <div className="px-12 pb-12 -mt-16 relative z-10 flex flex-col md:flex-row items-end gap-12">
            <div className="w-40 h-40 bg-[#0B1020] border-2 border-primary flex items-center justify-center overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.2)]">
              {team.logo_url ? (
                <img src={team.logo_url} className="w-full h-full object-cover" alt="Logo" />
              ) : (
                <span className="font-black italic text-6xl text-primary">{team?.name?.[0] || '?'}</span>
              )}
            </div>
            
            <div className="flex-1 text-center md:text-left space-y-4 pb-4">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest">Team Profile</span>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                  <Activity className="w-3 h-3" /> Active Since 2024
                </span>
              </div>
              <h1 className="text-6xl font-black tracking-tighter italic uppercase">{team.name}</h1>
              <p className="text-zinc-500 font-medium uppercase tracking-[0.2em] text-xs">Global Ranking: <span className="text-white">#0{team.rank || '1'}</span> • Division: <span className="text-primary italic">Elite Alpha</span></p>
            </div>

            <div className="grid grid-cols-2 gap-8 px-12 py-6 bg-white/5 border border-white/10 mb-4">
              <div className="text-center">
                <div className="text-3xl font-black italic uppercase tracking-tighter">{(team.points || 0).toLocaleString()}</div>
                <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Aggregate Pts</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black italic uppercase tracking-tighter">{team.solves || 0}</div>
                <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Total Captures</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="space-y-8">
            <div className="glass-card p-8 space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-widest border-b border-white/5 pb-4">Description</h3>
              <p className="text-xs text-zinc-400 leading-relaxed uppercase tracking-wider">
                {team.description || 'No description provided for this squad.'}
              </p>
              
              <div className="pt-4 space-y-3">
                {team.social_links?.github && (
                  <SocialLink icon={<Github className="w-4 h-4" />} label="GitHub" url={team.social_links.github} />
                )}
                {team.social_links?.discord && (
                  <SocialLink icon={<Users className="w-4 h-4" />} label="Discord" url={team.social_links.discord} />
                )}
                {team.social_links?.website && (
                  <SocialLink icon={<Globe className="w-4 h-4" />} label="Website" url={team.social_links.website} />
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="glass-card p-8">
              <h3 className="text-sm font-bold uppercase tracking-widest border-b border-white/5 pb-6 mb-6">Recent Captures</h3>
              <div className="p-12 border border-dashed border-white/10 text-center opacity-30">
                <Terminal className="w-8 h-8 mx-auto mb-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">No Recent Activity Recorded</span>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Modal */}
        <AnimatePresence>
          {showSettings && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowSettings(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative glass-card w-full max-w-xl overflow-hidden bg-[#0B1020]"
              >
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#050816]">
                  <h2 className="text-lg font-black italic uppercase tracking-tight">Squad Configuration</h2>
                  <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-white/5 transition-colors">
                    <X className="w-5 h-5 text-zinc-500" />
                  </button>
                </div>

                <form onSubmit={handleUpdate} className="p-8 space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Logo URL</label>
                    <input 
                      value={formData.logo_url}
                      onChange={e => setFormData({...formData, logo_url: e.target.value})}
                      className="w-full bg-[#050816] border border-white/5 px-4 py-2 text-xs font-bold uppercase tracking-widest focus:border-primary outline-none" 
                      placeholder="https://imgur.com/logo.png" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Banner URL</label>
                    <input 
                      value={formData.banner_url}
                      onChange={e => setFormData({...formData, banner_url: e.target.value})}
                      className="w-full bg-[#050816] border border-white/5 px-4 py-2 text-xs font-bold uppercase tracking-widest focus:border-primary outline-none" 
                      placeholder="https://imgur.com/banner.png" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Squad Description</label>
                    <textarea 
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      className="w-full h-24 bg-[#050816] border border-white/5 px-4 py-2 text-xs font-bold uppercase tracking-widest focus:border-primary outline-none resize-none" 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Discord</label>
                      <input 
                        value={formData.social_links.discord}
                        onChange={e => setFormData({...formData, social_links: {...formData.social_links, discord: e.target.value}})}
                        className="w-full bg-[#050816] border border-white/5 px-4 py-2 text-xs font-bold uppercase tracking-widest focus:border-primary outline-none" 
                        placeholder="https://discord.gg/..." 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">GitHub</label>
                      <input 
                        value={formData.social_links.github}
                        onChange={e => setFormData({...formData, social_links: {...formData.social_links, github: e.target.value}})}
                        className="w-full bg-[#050816] border border-white/5 px-4 py-2 text-xs font-bold uppercase tracking-widest focus:border-primary outline-none" 
                        placeholder="https://github.com/..." 
                      />
                    </div>
                  </div>

                  <button 
                    disabled={saving}
                    className="esports-button w-full flex items-center justify-center gap-2 !py-4"
                  >
                    <Save className="w-5 h-5" /> {saving ? 'SAVING...' : 'Update Squad Assets'}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function SocialLink({ icon, label, url }: any) {
  return (
    <a href={url} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 bg-white/5 border border-white/5 hover:border-primary/50 transition-all group">
      <div className="text-zinc-500 group-hover:text-primary transition-colors">{icon}</div>
      <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{label}</span>
    </a>
  );
}
