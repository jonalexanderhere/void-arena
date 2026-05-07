'use client';

import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-[#050816] z-[9999] flex flex-col items-center justify-center">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
        className="w-24 h-24 relative"
      >
        <img src="/logo.png" alt="Loading..." className="w-full h-full object-contain" />
        <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
      </motion.div>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-[10px] font-black uppercase tracking-[0.5em] text-primary"
      >
        Synchronizing Pulse
      </motion.div>
    </div>
  );
}
