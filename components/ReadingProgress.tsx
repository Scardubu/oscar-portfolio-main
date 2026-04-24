'use client';

import type { CSSProperties } from 'react';

import { useReadingProgress } from '@/hooks/useReadingProgress';

export function ReadingProgress() {
  const progress = useReadingProgress();

  return (
    <div
      className="reading-progress"
      role="progressbar"
      aria-label="Reading progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      // eslint-disable-next-line no-restricted-syntax
      style={{ '--progress': `${progress * 100}%` } as CSSProperties}
    />
  );
}
