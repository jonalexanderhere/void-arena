'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Terminal, Download, ExternalLink, 
  ChevronLeft, Trophy, Clock, Users, Send,
  AlertCircle, CheckCircle2, Globe
} from 'lucide-react';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Navbar } from '@/components/layout/Navbar';
import { FirstBloodAlert } from '@/components/shared/FirstBloodAlert';
import { detectProvider } from '@/lib/utils/storage';

export default function ChallengeDetailPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const tid = searchParams.get('tid');
  const [challenge, setChallenge] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [flag, setFlag] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [showFB, setShowFB] = useState(false);
  const [fbInfo, setFbInfo] = useState<any>(null);
  const supabase = createClientComponentClient();

  async function fetchChallenge() {
    if (!id || Array.isArray(id)) return;
    
    try {
      const { data, error } = await supabase
        .from('challenges')
        .select('*, challenge_files(*)')
        .eq('id', id as string)
        .single();
      
      if (error) throw error;
      setChallenge(data);
    } catch (err) {
      console.error('Error fetching challenge:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) fetchChallenge();
  }, [id]);

  const handleSubmitFlag = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId: id as string,
          flag: flag.trim(),
          tournamentId: tid || null,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus({ type: 'error', message: data.error || 'System error occurred.' });
        return;
      }

      if (data.correct) {
        setStatus({
          type: 'success',
          message: data.firstBlood ? 'ACCESS GRANTED: First Blood secured!' : 'ACCESS GRANTED: Flag accepted.',
        });
        setFlag('');

        if (data.firstBlood) {
          setFbInfo({
            teamName: data.userName,
            challengeName: data.challengeTitle,
            points: data.points,
          });
          setShowFB(true);
        }
      } else {
        setStatus({ type: 'error', message: 'ACCESS DENIED: Flag signature mismatch.' });
      }
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'System error during validation.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent animate-spin" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Synchronizing...</span>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-[#050816] text-white flex flex-col items-center justify-center p-6">
        <AlertCircle className="w-16 h-16 text-rose-500 mb-6" />
        <h1 className="text-2xl font-black uppercase italic tracking-tight mb-2">Challenge Not Found</h1>
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-8 text-center max-w-md">
          The requested data sector is unavailable or has been decommissioned.
        </p>
        <Link href="/classic" className="esports-button flex items-center gap-2">
          <ChevronLeft className="w-4 h-4" /> Return to Grid
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white selection:bg-primary/30">
      <Navbar />

      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <Link href="/classic" className="inline-flex items-center gap-2 text-[10px] font-bold text-zinc-500 hover:text-primary transition-colors uppercase tracking-widest mb-8 group">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Challenges
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Challenge Info */}
          <div className="lg:col-span-2 space-y-10">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest">
                  {challenge.category}
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${
                  challenge.difficulty === 'insane' ? 'text-rose-500' : 
                  challenge.difficulty === 'hard' ? 'text-amber-500' : 'text-emerald-500'
                }`}>
                  {challenge.difficulty} Difficulty
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter italic uppercase">{challenge.title}</h1>
              <div className="flex flex-wrap items-center gap-8 pt-4 border-b border-white/5 pb-8">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">{challenge.points} Points</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-zinc-500" />
                  <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">{challenge.solves || 0} Solves</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-zinc-500" />
                  <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Deployed 2d ago</span>
                </div>
              </div>
            </div>

            <div className="glass-card p-8 space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-widest border-b border-white/5 pb-4">Briefing</h3>
              <div className="prose prose-invert max-w-none text-zinc-400 text-sm leading-relaxed whitespace-pre-wrap">
                {challenge.description || 'No description available for this mission.'}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {challenge.challenge_url && (
                <div className="glass-card p-6 space-y-4 border-emerald-500/10">
                  <div className="flex items-center gap-3 text-emerald-500">
                    <Globe className="w-5 h-5" />
                    <h4 className="text-[10px] font-bold uppercase tracking-widest">Target Endpoint</h4>
                  </div>
                  <a 
                    href={challenge.challenge_url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="block bg-black/50 p-4 font-mono text-xs text-zinc-300 border border-emerald-500/20 hover:border-emerald-500/50 transition-all truncate"
                  >
                    {challenge.challenge_url}
                  </a>
                </div>
              )}
              
              {challenge.challenge_files?.length > 0 && (
                <div className="glass-card p-6 space-y-4 border-primary/10">
                  <div className="flex items-center gap-3 text-primary">
                    <Download className="w-5 h-5" />
                    <h4 className="text-[10px] font-bold uppercase tracking-widest">Asset Resources</h4>
                  </div>
                  <div className="space-y-2">
                    {challenge.challenge_files.map((file: any) => {
                      const provider = detectProvider(file.external_url);
                      const Icon = provider.icon;
                      return (
                        <a 
                          key={file.id} 
                          href={file.external_url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 border border-white/5 transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="w-4 h-4 text-zinc-500 group-hover:text-primary transition-colors" />
                            <div className="flex flex-col">
                              <span className="text-[10px] font-bold uppercase tracking-widest">{file.file_name}</span>
                              <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-tighter">{provider.name}</span>
                            </div>
                          </div>
                          <Download className="w-3 h-3 text-zinc-600" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Submission & Status */}
          <div className="space-y-8">
            <div className="glass-card p-8 space-y-6 border-primary/20 bg-primary/5">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <h3 className="text-sm font-bold uppercase tracking-widest">Flag Submission</h3>
              </div>
              
              <form onSubmit={handleSubmitFlag} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">Flag Signature</label>
                  <input 
                    type="text" 
                    value={flag}
                    onChange={(e) => setFlag(e.target.value)}
                    placeholder="VOID{...}"
                    className="w-full bg-[#050816] border border-white/10 px-4 py-3 text-sm font-mono focus:outline-none focus:border-primary transition-all text-primary"
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="esports-button w-full flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? 'Verifying...' : 'Initiate Handshake'} <Send className="w-4 h-4" />
                </button>
              </form>

              {status && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 border flex gap-3 ${
                    status.type === 'success' 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
                    : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                  }`}
                >
                  {status.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                  <div className="text-[10px] font-bold uppercase tracking-widest leading-tight">
                    {status.message}
                  </div>
                </motion.div>
              )}
            </div>

            <div className="glass-card p-8 space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-widest border-b border-white/5 pb-4">Operational First Blood</h3>
              {challenge.first_blood ? (
                <div className="flex items-center gap-4 p-4 bg-[#0B1020] border border-white/5">
                  <div className="w-12 h-12 bg-primary/10 border border-primary/20 flex items-center justify-center text-xl font-black italic text-primary">
                    {challenge.first_blood[0]}
                  </div>
                  <div>
                    <div className="text-xl font-black italic uppercase tracking-tight">{challenge.first_blood}</div>
                    <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">MISSION CAPTAIN</div>
                  </div>
                </div>
              ) : (
                <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest italic text-center py-4 border border-dashed border-white/10">
                  Awaiting initial penetration...
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <FirstBloodAlert
        show={showFB}
        teamName={fbInfo?.teamName}
        challengeName={fbInfo?.challengeName}
        points={fbInfo?.points}
        onDone={() => setShowFB(false)}
      />
    </div>
  );
}
