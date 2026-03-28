// PRD Phase 8: Sentry client-side error tracking
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN,

  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of transactions in production (adjust as needed)

  // Session Replay
  replaysSessionSampleRate: 0.1, // Sample 10% of sessions
  replaysOnErrorSampleRate: 1.0, // Capture 100% of sessions with errors

  // Environment
  environment: process.env.NODE_ENV,

  // Release tracking
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,

  // Filter out known issues
  ignoreErrors: [
    // Browser extensions
    "top.GLOBALS",
    "chrome-extension://",
    "moz-extension://",
    // Network errors
    "NetworkError",
    "Failed to fetch",
  ],

  // Breadcrumbs
  beforeBreadcrumb(breadcrumb) {
    // Filter out console logs in production
    if (breadcrumb.category === "console" && process.env.NODE_ENV === "production") {
      return null;
    }
    return breadcrumb;
  },
});
