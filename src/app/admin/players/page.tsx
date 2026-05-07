'use client';

import { AdminSidebar } from "@/components/admin/Sidebar";
import { Users } from "lucide-react";

export default function AdminPlayers() {
  return (
    <div className="min-h-screen bg-[#050816] text-white flex">
      <AdminSidebar />
      <main className="flex-1 p-10 space-y-10">
        <div className="space-y-2">
          <h1 className="text-3xl font-black italic uppercase italic tracking-tight">Recruit Directory</h1>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Manage platform players and permissions.</p>
        </div>
        <div className="glass-card p-10 flex items-center justify-center border-dashed border-white/10 text-zinc-500 uppercase font-black italic">
          Player Registry Accessing...
        </div>
      </main>
    </div>
  );
}
