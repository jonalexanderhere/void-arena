import { AdminSidebar } from '@/components/admin/Sidebar';
import Link from 'next/link';
import { Bell, Plus, Terminal, Trophy } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-[#050816] text-white selection:bg-primary/30">
      <div className="flex">
        <AdminSidebar />

        {/* Admin Main Content */}
        <main className="flex-1">
          {/* Header */}
          <header className="h-20 border-b border-white/5 bg-[#0B1020]/30 flex items-center justify-between px-10">
            <div className="flex items-center gap-4">
              <h2 className="text-sm font-bold uppercase tracking-widest">System Overview</h2>
              <div className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-500 rounded uppercase">All Systems Nominal</div>
            </div>
            <div className="flex items-center gap-6">
              <button className="relative p-2 hover:bg-white/5 transition-colors">
                <Bell className="w-5 h-5 text-zinc-500" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#0B1020]" />
              </button>
              <div className="h-8 w-[1px] bg-white/5" />
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs font-bold italic uppercase">Admin User</div>
                  <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Super Admin</div>
                </div>
                <div className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center font-black italic">A</div>
              </div>
            </div>
          </header>

          <div className="p-10 space-y-10">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <QuickStat label="Active Challenges" value="48" trend="+4 new" />
              <QuickStat label="Live Tournaments" value="3" trend="1 ending soon" />
              <QuickStat label="Total Solves" value="1,242" trend="+124 today" />
              <QuickStat label="Reports" value="0" trend="Clear" success />
            </div>

            {/* Management Sections */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
              {/* Recent Challenges */}
              <div className="glass-card rounded-none overflow-hidden">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-widest">Recent Challenges</h3>
                  <button className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase tracking-widest hover:bg-primary/20 transition-all">
                    <Plus className="w-3 h-3" /> New Challenge
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-white/5 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                        <th className="px-6 py-4">Title</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Difficulty</th>
                        <th className="px-6 py-4">Solves</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      <tr className="bg-white/5">
                        <td colSpan={5} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center gap-2 opacity-20">
                            <Terminal className="w-8 h-8" />
                            <div className="text-[9px] font-black uppercase tracking-widest">No Recent Submissions</div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="p-4 border-t border-white/5 text-center">
                  <Link href="/admin/challenges" className="text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-colors">View All Challenges</Link>
                </div>
              </div>

              {/* Tournament Control */}
              <div className="glass-card rounded-none overflow-hidden">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-widest">Active Tournaments</h3>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-[10px] font-bold text-white uppercase tracking-widest hover:bg-white/10 transition-all">
                    <Trophy className="w-3 h-3" /> All Events
                  </button>
                </div>
                <div className="p-12 flex flex-col items-center gap-4 opacity-20">
                  <Trophy className="w-12 h-12" />
                  <div className="text-[10px] font-black uppercase tracking-widest text-center">No Active Tournaments Scheduled</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}


function QuickStat({ label, value, trend, success = false }: any) {
  return (
    <div className="glass-card p-6">
      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">{label}</div>
      <div className="text-3xl font-black italic italic italic uppercase tracking-tighter mb-1">{value}</div>
      <div className={`text-[10px] font-bold uppercase tracking-widest ${success ? 'text-emerald-500' : 'text-primary'}`}>{trend}</div>
    </div>
  );
}
