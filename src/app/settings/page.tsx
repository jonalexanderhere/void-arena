'use client';

import { motion } from 'framer-motion';
import { Camera, Save, User, Shield, Zap, Bell, Globe, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';

export default function SettingsPage() {
  const [avatar, setAvatar] = useState('/logo.png');
  const [avatarUrlInput, setAvatarUrlInput] = useState('/logo.png');
  const [avatarError, setAvatarError] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('void_arena_avatar_url');
    if (saved) {
      setAvatar(saved);
      setAvatarUrlInput(saved);
    }
  }, []);

  const applyAvatarUrl = () => {
    try {
      const url = new URL(avatarUrlInput);
      if (!['http:', 'https:'].includes(url.protocol)) {
        setAvatarError('Avatar URL harus memakai http/https.');
        return;
      }
      setAvatarError('');
      setAvatar(url.toString());
      localStorage.setItem('void_arena_avatar_url', url.toString());
    } catch {
      setAvatarError('Avatar URL tidak valid.');
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white selection:bg-primary/30">
      <Navbar />

      <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto space-y-12">
        <div className="space-y-2 border-b border-white/5 pb-8">
          <h1 className="text-4xl font-black italic uppercase italic tracking-tighter">Command <span className="text-primary">Center</span></h1>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Manage your neural profile and system permissions.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Sidebar */}
          <aside className="space-y-4">
            <SettingsLink icon={<User />} label="Profile Info" active />
            <SettingsLink icon={<Shield />} label="Security" />
            <SettingsLink icon={<Zap />} label="Preferences" />
            <SettingsLink icon={<Bell />} label="Notifications" />
          </aside>

          {/* Main Form */}
          <div className="md:col-span-2 space-y-12">
            {/* Avatar Section */}
            <section className="space-y-6">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Neuro-Avatar</h2>
              <div className="flex items-center gap-8 p-8 bg-white/5 border border-white/5 relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-32 h-32 border-2 border-primary/20 p-2 shrink-0">
                  <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                  <button className="absolute bottom-0 right-0 p-2 bg-primary text-white hover:bg-primary/80 transition-all">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-4 relative z-10">
                  <div>
                    <h3 className="font-bold uppercase italic text-sm">Identity Matrix</h3>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Avatar via URL only (PNG, JPG, WEBP).</p>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="url"
                      value={avatarUrlInput}
                      onChange={(e) => setAvatarUrlInput(e.target.value)}
                      placeholder="https://cdn.example.com/avatar.png"
                      className="w-full bg-white/5 border border-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-widest focus:border-primary/50 transition-all outline-none"
                    />
                    {avatarError ? <p className="text-[10px] text-rose-400 font-bold uppercase tracking-widest">{avatarError}</p> : null}
                  </div>
                  <div className="flex gap-3">
                    <button onClick={applyAvatarUrl} type="button" className="esports-button !py-2 !px-4 !text-[9px]">Apply URL</button>
                    <button
                      type="button"
                      onClick={() => {
                        setAvatar('/logo.png');
                        setAvatarUrlInput('/logo.png');
                        setAvatarError('');
                        localStorage.removeItem('void_arena_avatar_url');
                      }}
                      className="p-2 border border-rose-500/20 text-rose-500 hover:bg-rose-500/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Profile Info */}
            <section className="space-y-6">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Neural Data</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Handle / Nickname</label>
                  <input className="w-full bg-white/5 border border-white/5 px-4 py-3 text-xs font-bold uppercase focus:border-primary transition-all outline-none" defaultValue="PHOENIX" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Assigned Email</label>
                  <input className="w-full bg-white/5 border border-white/10 px-4 py-3 text-xs font-bold uppercase text-zinc-600 cursor-not-allowed" disabled value="phoenix@void.arena" />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Bio / Combat Philosophy</label>
                  <textarea className="w-full h-32 bg-white/5 border border-white/5 px-4 py-3 text-xs font-bold uppercase focus:border-primary transition-all outline-none resize-none" defaultValue="Specialized in Kernel exploitation and high-frequency network penetration." />
                </div>
              </div>
            </section>

            <div className="pt-6">
              <button className="esports-button w-full flex items-center justify-center gap-2 !py-4">
                <Save className="w-5 h-5" /> Synchronize Changes
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
