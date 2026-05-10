'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// BookmarkToast is client-only and tiny — SSR: false prevents hydration mismatch
const BookmarkToast = dynamic(
  () => import('@/components/BookmarkToast').then((m) => ({ default: m.BookmarkToast })),
  { ssr: false }
);

export function BookmarkToastLoader() {
  return (
    <Suspense fallback={null}>
      <BookmarkToast />
    </Suspense>
  );
}