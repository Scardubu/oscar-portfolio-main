"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <h2 className="mb-4 text-2xl font-bold text-(--color-cyan)">Something went wrong</h2>
        <p className="mb-6 text-(--color-text-secondary)">
          An error occurred while loading this page.
        </p>
        <button
          onClick={reset}
          className="rounded bg-(--color-cyan) px-6 py-3 font-medium text-black transition-colors hover:bg-(--color-cyan-hover)"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
