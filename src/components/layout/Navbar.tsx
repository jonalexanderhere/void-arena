'use client';

import { Shield, Bell, User, Zap } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <nav className="h-20 border-b border-white/5 bg-[#050816]/80 backdrop-blur-xl fixed top-0 w-full z-50 px-6 flex items-center justify-between">
      <div className="flex items-center gap-12">
        <Link href="/" className="flex items-center gap-4 group">
          <div className="w-12 h-12 relative flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
            <img src="/logo.png" alt="VOID ARENA Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-2xl font-black tracking-tighter italic uppercase">
            VOID <span className="text-primary">ARENA</span>
          </span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <NavLink href="/dashboard" label="Overview" active={pathname === '/dashboard'} />
          <NavLink href="/classic" label="Classic" active={pathname === '/classic'} />
          <NavLink href="/tournaments" label="Tournaments" active={pathname === '/tournaments'} />
          <NavLink href="/scoreboard" label="Scoreboard" active={pathname === '/scoreboard'} />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-zinc-500 hover:text-white transition-colors group">
          <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-[#050816]" />
        </button>
        <div className="h-8 w-[1px] bg-white/5" />
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-black italic uppercase text-white tracking-tight">
              {user?.email?.split('@')?.[0] ?? 'Recruit_00'}
            </p>
            <p className="text-[10px] text-primary font-bold uppercase tracking-widest">
              {user ? 'Authenticated' : 'Guest Access'}
            </p>
          </div>
          <Link href={user ? "/profile" : "/login"} className="w-10 h-10 rounded-none border border-white/10 bg-white/5 flex items-center justify-center text-primary hover:border-primary/50 transition-colors">
            <User className="w-5 h-5" />
          </Link>
          {user && (
            <button 
              onClick={async () => {
                await supabase.auth.signOut();
                window.location.href = '/login';
              }}
              className="p-2 text-rose-500 hover:text-rose-400 hover:bg-rose-500/5 transition-all text-[10px] font-black uppercase tracking-widest border border-rose-500/10"
            >
              Log Out
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, label, active, accent }: { href: string, label: string, active?: boolean, accent?: boolean }) {
  return (
    <Link 
      href={href}
      className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 relative group
        ${active ? 'text-white' : 'text-zinc-500 hover:text-white'}
        ${accent ? 'text-primary' : ''}
      `}
    >
      {label}
      {active && (
        <span className="absolute -bottom-[33px] left-0 w-full h-[2px] bg-primary" />
      )}
      {!active && (
        <span className="absolute -bottom-[33px] left-0 w-0 h-[2px] bg-white/20 group-hover:w-full transition-all duration-300" />
      )}
    </Link>
  );
}
