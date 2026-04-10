'use client';
import dynamic from 'next/dynamic';

// ssr:false must live in a Client Component — Server Components forbid it.
const BookmarkToast = dynamic(
  () => import('@/components/BookmarkToast').then((m) => ({ default: m.BookmarkToast })),
  { ssr: false }
);

const CommandPalette = dynamic(
  () => import('@/components/CommandPalette').then((m) => ({ default: m.CommandPalette })),
  { ssr: false }
);

export function BookmarkToastLoader() {
  return (
    <>
      <BookmarkToast />
      <CommandPalette />
    </>
  );
}
