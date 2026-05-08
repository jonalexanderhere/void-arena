'use client';

import { motion } from 'framer-motion';
import { Camera, Save, User, Shield, Zap, Bell, Globe, Trash2, Link as LinkIcon, Github, Twitter, Image } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { isValidUrl } from '@/lib/utils/storage';

export default function SettingsPage() {
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  const [profile, setProfile] = useState({
    username: '',
    full_name: '',
    bio: '',
    avatar_url: '/logo.png',
    banner_url: '',
    social_links: {
      github: '',
      twitter: '',
      website: ''
    }
  });

  const [status, setStatus] = useState('');

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/login';
        return;
      }
      setUser(user);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data && !error) {
        setProfile({
          username: data.username || '',
          full_name: data.full_name || '',
          bio: data.bio || '',
          avatar_url: data.avatar_url || '/logo.png',
          banner_url: data.banner_url || '',
          social_links: {
            github: data.social_links?.github || '',
            twitter: data.social_links?.twitter || '',
            website: data.social_links?.website || ''
          }
        });
      }
      setLoading(false);
    }
    loadProfile();
  }, []);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setStatus('Synchronizing changes...');

    const { error } = await supabase
      .from('profiles')
      .update({
        username: profile.username,
        full_name: profile.full_name,
        bio: profile.bio,
        avatar_url: profile.avatar_url,
        banner_url: profile.banner_url,
        social_links: profile.social_links
      })
      .eq('id', user.id);

    if (error) {
      setStatus('Sync failed: ' + error.message);
    } else {
      setStatus('Neural profile synchronized successfully.');
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

  return (
    <div className="min-h-screen bg-[#050816] text-white selection:bg-primary/30">
      <Navbar />

      <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto space-y-12">
        <div className="space-y-2 border-b border-white/5 pb-8">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">Command <span className="text-primary">Center</span></h1>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Manage your neural profile and system permissions.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <aside className="space-y-4">
            <SettingsLink icon={<User />} label="Profile Info" active />
            <SettingsLink icon={<Shield />} label="Security" />
            <SettingsLink icon={<Zap />} label="Preferences" />
            <SettingsLink icon={<Bell />} label="Notifications" />
          </aside>

          <div className="md:col-span-2 space-y-12">
            <section className="space-y-6">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Neuro-Assets</h2>
              
              {/* Avatar */}
              <div className="p-8 bg-white/5 border border-white/5 space-y-6">
                <div className="flex items-center gap-8">
                  <div className="relative w-24 h-24 border-2 border-primary/20 p-1 shrink-0 bg-black">
                    <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-white">Avatar Matrix</h3>
                      <p className="text-[10px] text-zinc-500 uppercase font-bold mt-1 tracking-wider">Public URL only (PNG/JPG/WEBP)</p>
                    </div>
                    <input
                      type="url"
                      value={profile.avatar_url}
                      onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value })}
                      placeholder="https://imgur.com/avatar.png"
                      className="w-full bg-[#0B1020] border border-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-widest focus:border-primary/50 transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Banner */}
                <div className="space-y-3">
                  <div className="h-24 w-full bg-[#0B1020] border border-white/10 relative overflow-hidden">
                    {profile.banner_url ? (
                      <img src={profile.banner_url} className="w-full h-full object-cover opacity-50" alt="Banner" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center opacity-20">
                        <Image className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-white">Profile Banner</h3>
                    <p className="text-[10px] text-zinc-500 uppercase font-bold mt-1 tracking-wider">Cinematic header via external link</p>
                  </div>
                  <input
                    type="url"
                    value={profile.banner_url}
                    onChange={(e) => setProfile({ ...profile, banner_url: e.target.value })}
                    placeholder="https://imgur.com/banner.png"
                    className="w-full bg-[#0B1020] border border-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-widest focus:border-primary/50 transition-all outline-none"
                  />
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Neural Data</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Handle / Nickname</label>
                  <input 
                    value={profile.username}
                    onChange={(e) => setProfile({...profile, username: e.target.value})}
                    className="w-full bg-white/5 border border-white/5 px-4 py-3 text-xs font-bold uppercase focus:border-primary transition-all outline-none" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Assigned Email</label>
                  <input className="w-full bg-white/5 border border-white/10 px-4 py-3 text-xs font-bold uppercase text-zinc-600 cursor-not-allowed" disabled value={user?.email} />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Bio / Combat Philosophy</label>
                  <textarea 
                    value={profile.bio}
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    className="w-full h-32 bg-white/5 border border-white/5 px-4 py-3 text-xs font-bold uppercase focus:border-primary transition-all outline-none resize-none" 
                  />
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Social Uplinks</h2>
              <div className="grid grid-cols-1 gap-4">
                <SocialInput 
                  icon={<Github className="w-4 h-4" />} 
                  label="GitHub" 
                  value={profile.social_links.github} 
                  onChange={(v: string) => setProfile({...profile, social_links: {...profile.social_links, github: v}})}
                />
                <SocialInput 
                  icon={<Twitter className="w-4 h-4" />} 
                  label="Twitter / X" 
                  value={profile.social_links.twitter} 
                  onChange={(v: string) => setProfile({...profile, social_links: {...profile.social_links, twitter: v}})}
                />
                <SocialInput 
                  icon={<Globe className="w-4 h-4" />} 
                  label="Personal Site" 
                  value={profile.social_links.website} 
                  onChange={(v: string) => setProfile({...profile, social_links: {...profile.social_links, website: v}})}
                />
              </div>
            </section>

            <div className="pt-6 space-y-4">
              {status && <p className={`text-[10px] font-bold uppercase tracking-widest ${status.includes('failed') ? 'text-rose-500' : 'text-primary'}`}>{status}</p>}
              <button 
                onClick={handleSave}
                disabled={saving}
                className="esports-button w-full flex items-center justify-center gap-2 !py-4 disabled:opacity-50"
              >
                <Save className="w-5 h-5" /> {saving ? 'SYNCHRONIZING...' : 'Synchronize Changes'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SettingsLink({ icon, label, active }: any) {
  return (
    <button className={`w-full flex items-center gap-4 px-6 py-4 transition-all group border-l-2
      ${active ? 'bg-primary/10 border-primary text-white' : 'border-transparent text-zinc-500 hover:text-white hover:bg-white/5'}
    `}>
      <div className={`transition-transform group-hover:scale-110 ${active ? 'text-primary' : ''}`}>{icon}</div>
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}

function SocialInput({ icon, label, value, onChange }: any) {
  return (
    <div className="flex items-center gap-4 bg-white/5 border border-white/5 p-4">
      <div className="p-2 bg-white/5 text-zinc-400">{icon}</div>
      <div className="flex-1">
        <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{label}</div>
        <input 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
          className="w-full bg-transparent text-xs font-bold outline-none focus:text-primary transition-colors"
        />
      </div>
    </div>
  );
}
