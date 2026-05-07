'use client';

import { useEffect, useCallback } from 'react';

// Sound definitions
const SOUNDS = {
  FIRST_BLOOD: '/sounds/first-blood.mp3',
  SOLVED: '/sounds/solve.mp3',
  NOTIFICATION: '/sounds/notify.mp3',
};

export function useSoundEffects() {
  const playSound = useCallback((soundKey: keyof typeof SOUNDS) => {
    const audio = new Audio(SOUNDS[soundKey]);
    audio.volume = 0.5;
    audio.play().catch(err => console.log('Audio playback blocked or file missing:', err));
  }, []);

  return { playSound };
}

export function SoundManager() {
  // This component doesn't render anything, it's just a placeholder for future sound-related logic
  return null;
}
