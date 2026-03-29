import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-[var(--color-cyan)]">404</h1>
        <h2 className="mb-4 text-2xl font-semibold text-white">Page Not Found</h2>
        <p className="mb-6 text-[var(--color-text-secondary)]">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block rounded bg-[var(--color-cyan)] px-6 py-3 font-medium text-black transition-colors hover:bg-[var(--color-cyan-hover)]"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
