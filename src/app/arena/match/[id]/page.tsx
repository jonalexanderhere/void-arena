'use client';

import { useParams } from 'next/navigation';
import ArenaHUD from '../page'; // Reuse the layout

export default function MatchPage() {
  const { id } = useParams();
  // In a real app, fetch match data by ID here
  return <ArenaHUD />;
}
