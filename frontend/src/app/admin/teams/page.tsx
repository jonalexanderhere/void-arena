'use client';

import { AdminSidebar } from "@/components/admin/Sidebar";
import { Users, Search, Filter } from "lucide-react";

export default function AdminTeams() {
  return (
    <div className="min-h-screen bg-[#050816] text-white flex">
      <AdminSidebar />
      <main className="flex-1 p-10 space-y-10">
        <div className="space-y-2">
          <h1 className="text-3xl font-black italic uppercase italic tracking-tight">Squad Management</h1>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Review and manage all registered teams.</p>
        </div>
        <div className="glass-card p-10 flex items-center justify-center border-dashed border-white/10 text-zinc-500 uppercase font-black italic">
          Team Database Loading...
        </div>
      </main>
    </div>
  );
}
