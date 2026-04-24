"use client";

import { useEffect } from "react";

function isChunkLoadError(error: Error): boolean {
  return (
    error.name === "ChunkLoadError" ||
    error.message.includes("Loading chunk") ||
    error.message.includes("Failed to fetch dynamically imported module")
  );
}

export default function ErrorPage({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  const chunkError = isChunkLoadError(error);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error("[ErrorPage]", error);
    }
  }, [error]);

  // Auto-reload once on ChunkLoadError — typically a CDN propagation hiccup.
  // sessionStorage guard prevents an infinite reload loop.
  useEffect(() => {
    if (!chunkError) return;
    const attempts = parseInt(
      typeof window !== "undefined"
        ? (window.sessionStorage.getItem("chunk-reload-attempts") ?? "0")
        : "0"
    );
    if (attempts < 1) {
      window.sessionStorage.setItem("chunk-reload-attempts", String(attempts + 1));
      window.location.reload();
    }
  }, [chunkError]);

  if (chunkError) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold text-(--color-cyan)">
            Fetching latest assets…
          </h2>
          <p className="mb-6 text-(--color-text-secondary)">
            A resource failed to load. Reloading automatically — or tap below.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded bg-(--color-cyan) px-6 py-3 font-medium text-black transition-colors hover:bg-(--color-cyan-hover)"
          >
            Reload page
          </button>
        </div>
      </div>
    );
  }

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
