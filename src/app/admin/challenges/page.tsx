import { AdminSidebar } from '@/components/admin/Sidebar';

export default function AdminChallenges() {
  return (
    <div className="min-h-screen bg-[#050816] text-white flex">
      <AdminSidebar />

      <main className="flex-1 p-10 space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-black italic uppercase italic italic tracking-tight">Challenge Repository</h1>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Manage your library of 48 active challenges.</p>
          </div>
          <button className="esports-button flex items-center gap-2 !py-3 !px-8 !text-xs">
            <Plus className="w-4 h-4" /> Create Challenge
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-hover:text-primary transition-colors" />
            <input 
              type="text" 
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
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {/* Data will be fetched from API */}
              <tr className="bg-white/5">
                <td colSpan={6} className="px-8 py-20 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <Terminal className="w-12 h-12 text-zinc-700 animate-pulse" />
                    <div className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600">Syncing Challenge Repository...</div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

function AdminLink({ href, icon, label, active = false }: any) {
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
        active 
          ? 'bg-primary text-white italic italic italic rounded-none' 
          : 'text-zinc-500 hover:text-white hover:bg-white/5'
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}
