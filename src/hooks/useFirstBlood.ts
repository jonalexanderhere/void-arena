'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface FirstBloodData {
  teamName: string;
  challengeName: string;
  points: number;
}

export function useFirstBlood() {
  const [showAlert, setShowAlert] = useState(false);
  const [fbData, setFbData] = useState<FirstBloodData | null>(null);
  const playedRef = useRef<Set<string>>(new Set());
  const supabase = createClientComponentClient();

  // Listen for realtime notifications from Supabase
  useEffect(() => {
    const channel = supabase
      .channel('first-blood-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: 'type=eq.first_blood',
        },
        (payload) => {
          const data = payload.new as any;
          const id = `${data?.challenge_id ?? ''}-${data?.user_id ?? ''}`;
          if (playedRef.current.has(id)) return;
          playedRef.current.add(id);

          setFbData({
            teamName: data?.data?.teamName ?? data?.message ?? '',
            challengeName: data?.data?.challengeName ?? '',
            points: data?.data?.points ?? 0,
          });
          setShowAlert(true);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const triggerFirstBlood = useCallback((data: FirstBloodData) => {
    const id = `${data.teamName}-${data.challengeName}`;
    if (playedRef.current.has(id)) return;
    playedRef.current.add(id);

    setFbData(data);
    setShowAlert(true);
  }, []);

  const dismissAlert = useCallback(() => {
    setShowAlert(false);
  }, []);

  return {
    showAlert,
    fbData,
    triggerFirstBlood,
    dismissAlert,
  };
}