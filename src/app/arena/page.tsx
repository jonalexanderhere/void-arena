'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, ChevronRight, Clock, Download, ExternalLink, Terminal, LogOut } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { FirstBloodAlert } from '@/components/shared/FirstBloodAlert';
import { useFirstBlood } from '@/hooks/useFirstBlood';
import { detectProvider } from '@/lib/utils/storage';

type Challenge = {
  id: string;
  title: string;
  description?: string;
  category: string;
  difficulty: string;
  speedrun_timer?: number;
  challenge_url?: string | null;
  file_url?: string | null;
  files?: string[] | null;
  challenge_files?: any[];
};

export default function ArenaHUD() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [activeId, setActiveId] = useState('');
  const [flag, setFlag] = useState('');
  const [status, setStatus] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [showFirstBlood, setShowFirstBlood] = useState(false);
  const [fbData, setFbData] = useState<any>(null);
  const { showAlert: realtimeFB, fbData: realtimeFbData, triggerFirstBlood, dismissAlert } = useFirstBlood();
  const supabase = createClientComponentClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const active = useMemo(() => challenges.find((c) => c.id === activeId) ?? null, [challenges, activeId]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/challenges');
      const data = await res.json();
      if (!res.ok || !Array.isArray(data)) {
        setStatus(data?.error ?? 'Failed to load challenges.');
        return;
      }
      setChallenges(data);
      if (data.length) {
        setActiveId(data[0].id);
        setTimeLeft(Number(data[0].speedrun_timer ?? 300));
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!active) return;
    setTimeLeft(Number(active.speedrun_timer ?? 300));
  }, [activeId, active]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const submitFlag = async () => {
    if (!active || !flag.trim()) return;
    setStatus('Verifying flag...');

    const res = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ challengeId: active.id, flag: flag.trim(), userId: null, teamId: null }),
    });
    const data = await res.json();

    if (!res.ok) {
      setStatus(data?.error ?? 'Submit failed.');
      return;
    }

    if (data.correct) {
      setStatus(data.firstBlood ? 'Correct! FIRST BLOOD secured.' : 'Correct flag submitted.');
      if (data.firstBlood) {
        setFbData({
          teamName: data.userName,
          challengeName: data.challengeTitle,
          points: data.points,
        });
        setShowFirstBlood(true);
      }
      setFlag('');
      return;
    }

    setStatus('Incorrect flag. Try again.');
  };

  const downloadUrl = active?.file_url || active?.files?.[0] || '';

  return (
    <div className="min-h-screen bg-[#050816] text-white overflow-hidden relative selection:bg-primary/30">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.1),transparent)] pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />

      <header className="fixed top-0 left-0 w-full z-50 p-6 flex justify-between items-center px-10">
        <div className="flex items-center gap-4">
          <Link href="/" className="w-10 h-10 bg-primary flex items-center justify-center rotate-45 hover:scale-110 transition-transform">
            <Terminal className="w-6 h-6 -rotate-45" />
          </Link>
          <div className="hidden md:block">
            <h2 className="text-sm font-black tracking-tighter italic uppercase">Arena <span className="text-primary">HUD</span></h2>
            <div className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Tactical Environment v2.4</div>
          </div>
        </div>

        <div className="glass-card px-8 py-3 border-white/10 flex items-center gap-6">
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Timer</div>
          <div className="text-3xl font-mono font-bold tracking-widest text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            {formatTime(timeLeft)}
          </div>
          <div className="h-8 w-[1px] bg-white/5" />
          <div className="text-[10px] font-bold text-primary uppercase tracking-widest">{active?.difficulty ?? 'N/A'} · {active?.category ?? 'N/A'}</div>
        </div>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 border border-rose-500/20 text-[10px] font-black text-rose-500 uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all group"
        >
          <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          <span className="hidden md:inline">Abort Mission</span>
        </button>
      </header>

      <main className="pt-32 pb-24 px-6 h-full flex gap-6">
        <aside className="w-96 flex flex-col gap-6">
          <div className="glass-card p-6 space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <Terminal className="w-6 h-6 text-primary" />
              <div>
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Active Challenge</h3>
                <h2 className="text-xl font-black tracking-tight italic uppercase">{active?.title ?? 'No Challenge'}</h2>
              </div>
            </div>

            <p className="text-sm text-zinc-400 leading-relaxed">{active?.description ?? 'Select a challenge from the queue to begin your speedrun round.'}</p>

            <div className="grid grid-cols-1 gap-2 max-h-72 overflow-auto pr-1">
              {challenges.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveId(c.id)}
                  className={`text-left p-3 border text-[10px] font-bold uppercase tracking-widest transition-all ${
                    c.id === activeId ? 'border-primary bg-primary/10 text-primary' : 'border-white/10 bg-white/5 text-zinc-300 hover:border-white/30'
                  }`}
                >
                  {c.title}
                </button>
              ))}
            </div>

            <div className="space-y-3 pt-4 border-t border-white/5">
              {active?.challenge_files && active.challenge_files.length > 0 ? (
                active.challenge_files.map((file: any) => {
                  const provider = detectProvider(file.external_url);
                  const Icon = provider.icon;
                  return (
                    <div key={file.id} className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 group hover:border-primary/50 transition-all">
                      <div className="p-2 bg-black/40 text-zinc-400 group-hover:text-primary transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{provider.name}</div>
                        <div className="text-[10px] font-black uppercase truncate">{file.file_name}</div>
                      </div>
                      <a 
                        href={file.external_url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="p-2 bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all rounded-sm"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  );
                })
              ) : active?.file_url ? (
                <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 group hover:border-primary/50 transition-all">
                  <div className="p-2 bg-black/40 text-zinc-400 group-hover:text-primary transition-colors">
                    <Download className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">EXTERNAL FILE</div>
                    <div className="text-[10px] font-black uppercase truncate">Download Assets</div>
                  </div>
                  <a 
                    href={active.file_url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="p-2 bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all rounded-sm"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              ) : null}

              {active?.challenge_url && (
                <a href={active.challenge_url} target="_blank" rel="noreferrer" className="w-full esports-button-outline !py-3 !text-[10px] inline-flex items-center justify-center gap-2">
                  <ExternalLink className="w-4 h-4" /> Open Challenge URL
                </a>
              )}
            </div>
          </div>

          <div className="glass-card p-6 bg-rose-500/5 border-rose-500/20">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-5 h-5 text-rose-500" />
              <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em]">Match Status</h4>
            </div>
            <p className="text-[11px] text-zinc-400">{status || 'Waiting for submission...'}</p>
          </div>
        </aside>

        <section className="flex-1 flex flex-col items-center justify-center gap-12">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-xl space-y-8">
            <div className="text-center space-y-2">
              <div className="text-[10px] font-bold text-primary uppercase tracking-[0.5em]">SUBMIT FLAG</div>
              <h2 className="text-4xl font-black italic tracking-tighter uppercase">Capture the Lead</h2>
            </div>

            <div className="relative group">
              <input
                type="text"
                value={flag}
                onChange={(e) => setFlag(e.target.value)}
                placeholder="FLAG{...}"
                className="w-full bg-[#0B1020]/80 backdrop-blur-xl border-2 border-white/10 px-8 py-6 text-xl font-mono font-bold text-center tracking-widest focus:outline-none focus:border-primary transition-all uppercase"
              />
            </div>

            <div className="flex justify-center">
              <button onClick={submitFlag} className="esports-button group">
                Verify Solution <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </motion.div>
        </section>
      </main>

      {/* First Blood alert from local solve */}
      <FirstBloodAlert
        show={showFirstBlood}
        teamName={fbData?.teamName}
        challengeName={fbData?.challengeName}
        points={fbData?.points}
        onDone={() => setShowFirstBlood(false)}
      />

      {/* First Blood alert from realtime notifications (other users' solves) */}
      <FirstBloodAlert
        show={realtimeFB}
        teamName={realtimeFbData?.teamName}
        challengeName={realtimeFbData?.challengeName}
        points={realtimeFbData?.points}
        onDone={dismissAlert}
      />
    </div>
  );
}
