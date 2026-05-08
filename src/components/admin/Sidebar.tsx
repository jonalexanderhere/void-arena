'use client';

import { Shield, LayoutDashboard, Terminal, Trophy, Users, BarChart3, Activity, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export function AdminSidebar() {
  const pathname = usePathname();
  const supabase = createClientComponentClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <aside className="w-64 min-h-screen border-r border-white/5 bg-[#0B1020]/80 backdrop-blur-xl sticky top-0 shrink-0 flex flex-col">
      <div className="p-6 border-b border-white/5">
        <Link href="/" className="flex items-center gap-4 group">
          <div className="w-10 h-10 relative flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
            <img src="/logo.png" alt="VOID ARENA Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-xl font-black tracking-tighter italic uppercase">VOID <span className="text-zinc-500">ADMIN</span></span>
        </Link>
      </div>

      <nav className="p-4 space-y-1 flex-1">
        <AdminLink href="/admin" icon={<LayoutDashboard className="w-4 h-4" />} label="Overview" active={pathname === '/admin'} />
        <AdminLink href="/admin/challenges" icon={<Terminal className="w-4 h-4" />} label="Challenges" active={pathname === '/admin/challenges'} />
        <AdminLink href="/admin/tournaments" icon={<Trophy className="w-4 h-4" />} label="Tournaments" active={pathname === '/admin/tournaments'} />
        <AdminLink href="/admin/teams" icon={<Users className="w-4 h-4" />} label="Teams" active={pathname === '/admin/teams'} />
        <AdminLink href="/admin/players" icon={<Users className="w-4 h-4" />} label="Players" active={pathname === '/admin/players'} />
        <div className="pt-4 pb-2 px-4">
          <h4 className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Platform</h4>
        </div>
        <AdminLink href="/admin/stats" icon={<BarChart3 className="w-4 h-4" />} label="Analytics" active={pathname === '/admin/stats'} />
        <AdminLink href="/admin/logs" icon={<Activity className="w-4 h-4" />} label="Audit Logs" active={pathname === '/admin/logs'} />
        <AdminLink href="/admin/settings" icon={<Settings className="w-4 h-4" />} label="Settings" active={pathname === '/admin/settings'} />
      </nav>

      <div className="p-4 border-t border-white/5">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest text-rose-500 hover:text-rose-400 hover:bg-rose-500/5 transition-all duration-300"
        >
          <LogOut className="w-4 h-4" />
          Terminate Session
        </button>
      </div>
    </aside>
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
