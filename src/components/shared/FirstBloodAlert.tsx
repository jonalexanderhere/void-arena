'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface FirstBloodAlertProps {
  show: boolean;
  teamName?: string;
  challengeName?: string;
  points?: number;
  onDone?: () => void;
  duration?: number;
}

export function FirstBloodAlert({
  show,
  teamName,
  challengeName,
  points,
  onDone,
  duration = 4500,
}: FirstBloodAlertProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!show) return;

    // Play first blood MP3
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio('/sounds/first-blood.mp3');
        audioRef.current.volume = 0.6;
      }
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    } catch {}

    const timer = setTimeout(() => {
      onDone?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [show, duration, onDone]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.5 }}
          className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none"
        >
          <div className="absolute inset-0 bg-rose-900/40 backdrop-blur-sm animate-pulse" />
          <div className="relative text-center space-y-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-rose-500 font-black italic text-7xl md:text-9xl tracking-tighter uppercase skew-x-[-12deg] drop-shadow-[0_0_40px_rgba(244,63,94,0.6)]"
            >
              FIRST BLOOD
            </motion.div>

            {(teamName || challengeName) && (
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
              >
                {teamName && (
                  <div className="text-3xl md:text-4xl font-black italic uppercase text-white tracking-tight">
                    {teamName}
                  </div>
                )}
                {challengeName && (
                  <div className="text-lg font-bold uppercase tracking-widest text-zinc-300">
                    Captured: <span className="text-white italic">{challengeName}</span>
                  </div>
                )}
                {points && (
                  <div className="inline-block px-8 py-2 bg-rose-500 text-black font-black uppercase tracking-[0.3em] italic skew-x-[-12deg] text-sm">
                    {points} PTS
                  </div>
                )}
              </motion.div>
            )}

            {/* Notification sound indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center gap-2 text-zinc-400"
            >
              <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Notification Active</span>
              <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
