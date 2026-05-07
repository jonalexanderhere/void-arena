'use client';

import { AdminSidebar } from '@/components/admin/Sidebar';
import { Filter, Plus, Search, Terminal } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type ChallengeItem = {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  challenge_url?: string;
  file_url?: string;
  avatar_url?: string;
};

const categories = ['Web Exploitation', 'Cryptography', 'Reverse Engineering', 'Pwn', 'Forensics', 'OSINT', 'Mobile', 'Cloud', 'Hardware', 'AI Security', 'Misc'];
const difficulties = ['Easy', 'Medium', 'Hard', 'Insane', 'Elite'];

export default function AdminChallenges() {
  const [list, setList] = useState<ChallengeItem[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [form, setForm] = useState({
    title: '',
    category: 'Web Exploitation',
    difficulty: 'Easy',
    challenge_url: '',
    file_url: '',
    avatar_url: '',
  });

  const load = async () => {
    const res = await fetch('/api/challenges');
    const data = await res.json();
    if (res.ok && Array.isArray(data)) {
      setList(data as ChallengeItem[]);
      setStatus('Challenge list synced.');
      return;
    }
    setStatus(data?.error ?? 'Failed to load challenges.');
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return list.filter((item) =>
      item.title?.toLowerCase().includes(q) ||
      item.category?.toLowerCase().includes(q) ||
      item.id?.toLowerCase().includes(q)
    );
  }, [list, search]);

  const createChallenge = async () => {
    setStatus('Creating challenge...');
    const res = await fetch('/api/challenges', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus(data?.error ?? 'Create failed.');
      return;
    }
    setForm({
      title: '',
      category: 'Web Exploitation',
      difficulty: 'Easy',
      challenge_url: '',
      file_url: '',
      avatar_url: '',
    });
    await load();
    setStatus('Challenge created with URL links (no binary upload).');
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white flex">
      <AdminSidebar />

      <main className="flex-1 p-10 space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-black italic uppercase tracking-tight">Challenge Repository</h1>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Store URL links only for avatar/file/challenge endpoint to keep DB lightweight.</p>
          </div>
        </div>

        <div className="glass-card p-6 border-white/10 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="CHALLENGE TITLE"
              className="w-full bg-[#0B1020] border border-white/10 px-4 py-3 text-[10px] font-bold uppercase tracking-widest"
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full bg-[#0B1020] border border-white/10 px-4 py-3 text-[10px] font-bold uppercase tracking-widest"
            >
              {categories.map((x) => <option key={x}>{x}</option>)}
            </select>
            <select
              value={form.difficulty}
              onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
              className="w-full bg-[#0B1020] border border-white/10 px-4 py-3 text-[10px] font-bold uppercase tracking-widest"
            >
              {difficulties.map((x) => <option key={x}>{x}</option>)}
            </select>
            <input
              type="url"
              value={form.challenge_url}
              onChange={(e) => setForm({ ...form, challenge_url: e.target.value })}
              placeholder="https://challenge.example.com"
              className="w-full bg-[#0B1020] border border-white/10 px-4 py-3 text-[10px] font-bold tracking-wide"
            />
            <input
              type="url"
              value={form.file_url}
              onChange={(e) => setForm({ ...form, file_url: e.target.value })}
              placeholder="https://cdn.example.com/challenge.zip"
              className="w-full bg-[#0B1020] border border-white/10 px-4 py-3 text-[10px] font-bold tracking-wide"
            />
            <input
              type="url"
              value={form.avatar_url}
              onChange={(e) => setForm({ ...form, avatar_url: e.target.value })}
              placeholder="https://cdn.example.com/challenge-cover.png"
              className="w-full bg-[#0B1020] border border-white/10 px-4 py-3 text-[10px] font-bold tracking-wide"
            />
          </div>
          <button onClick={createChallenge} className="esports-button flex items-center gap-2 !py-3 !px-8 !text-xs">
            <Plus className="w-4 h-4" /> Create Challenge (URL Mode)
          </button>
          {status ? <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{status}</p> : null}
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-hover:text-primary transition-colors" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
                <th className="px-8 py-6">Challenge URL</th>
                <th className="px-8 py-6">File URL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length ? filtered.map((row) => (
                <tr key={row.id} className="bg-white/5">
                  <td className="px-8 py-4 text-[11px] font-mono">{row.id}</td>
                  <td className="px-8 py-4 text-[11px] font-bold uppercase">{row.title}</td>
                  <td className="px-8 py-4 text-[11px]">{row.category}</td>
                  <td className="px-8 py-4 text-[11px]">{row.difficulty}</td>
                  <td className="px-8 py-4 text-[11px]"><a className="text-primary" href={row.challenge_url} target="_blank" rel="noreferrer">{row.challenge_url ? 'Open' : '-'}</a></td>
                  <td className="px-8 py-4 text-[11px]"><a className="text-primary" href={row.file_url} target="_blank" rel="noreferrer">{row.file_url ? 'Open' : '-'}</a></td>
                </tr>
              )) : (
                <tr className="bg-white/5">
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Terminal className="w-12 h-12 text-zinc-700 animate-pulse" />
                      <div className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600">No Challenges Found</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
