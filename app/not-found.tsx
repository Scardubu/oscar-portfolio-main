import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-[#00d9ff]">404</h1>
        <h2 className="mb-4 text-2xl font-semibold text-white">Page Not Found</h2>
        <p className="mb-6 text-gray-400">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block rounded bg-[#00d9ff] px-6 py-3 font-medium text-black transition-colors hover:bg-[#00a8cc]"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
