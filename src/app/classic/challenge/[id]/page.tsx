'use client';

import { useParams } from 'next/navigation';
import ClassicModePage from '../../page'; // Reuse listing layout until detail page is implemented

export default function DynamicChallengePage() {
  const { id } = useParams();
  void id;
  return <ClassicModePage />;
}
