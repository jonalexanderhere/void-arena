'use client';

import { useParams } from 'next/navigation';
import ChallengeDetailPage from './gh-injection/page'; // Reuse the layout

export default function DynamicChallengePage() {
  const { id } = useParams();
  // In a real app, fetch challenge data by ID here
  return <ChallengeDetailPage />;
}
