'use client';

import { AdminSidebar } from "@/components/admin/Sidebar";
import { Settings } from "lucide-react";

export default function AdminSettings() {
  return (
    <div className="min-h-screen bg-[#050816] text-white flex">
      <AdminSidebar />
      <main className="flex-1 p-10 space-y-10">
        <div className="space-y-2">
          <h1 className="text-3xl font-black italic uppercase italic tracking-tight">Platform Configuration</h1>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Global system parameters and security.</p>
        </div>
        <div className="glass-card p-10 flex items-center justify-center border-dashed border-white/10 text-zinc-500 uppercase font-black italic">
          Accessing Kernel Settings...
        </div>
      </main>
    </div>
  );
}
