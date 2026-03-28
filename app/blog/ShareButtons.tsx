"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Share2,
  Twitter,
  Linkedin,
  Mail,
  MessageCircle,
  Link2,
  Check,
  ExternalLink,
} from "lucide-react";
import { trackEvent } from "@/app/lib/analytics";

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  variant?: "inline" | "floating";
}

interface ShareOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  hoverColor: string;
  getUrl: (url: string, title: string) => string;
}

const SHARE_OPTIONS: ShareOption[] = [
  {
    id: "twitter",
    label: "Twitter/X",
    icon: <Twitter className="h-4 w-4" />,
    color: "text-gray-400",
    hoverColor: "hover:bg-sky-500/20 hover:text-sky-400 hover:border-sky-500/30",
    getUrl: (url, title) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    icon: <Linkedin className="h-4 w-4" />,
    color: "text-gray-400",
    hoverColor: "hover:bg-blue-500/20 hover:text-blue-400 hover:border-blue-500/30",
    getUrl: (url) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    icon: <MessageCircle className="h-4 w-4" />,
    color: "text-gray-400",
    hoverColor: "hover:bg-green-500/20 hover:text-green-400 hover:border-green-500/30",
    getUrl: (url, title) =>
      `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
  },
  {
    id: "email",
    label: "Email",
    icon: <Mail className="h-4 w-4" />,
    color: "text-gray-400",
    hoverColor: "hover:bg-amber-500/20 hover:text-amber-400 hover:border-amber-500/30",
    getUrl: (url, title) =>
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check out this article: ${url}`)}`,
  },
  {
    id: "hackernews",
    label: "Hacker News",
    icon: <ExternalLink className="h-4 w-4" />,
    color: "text-gray-400",
    hoverColor: "hover:bg-orange-500/20 hover:text-orange-400 hover:border-orange-500/30",
    getUrl: (url, title) =>
      `https://news.ycombinator.com/submitlink?u=${encodeURIComponent(url)}&t=${encodeURIComponent(title)}`,
  },
];

export function ShareButtons({
  url,
  title,
  description,
  variant = "inline",
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  // Check if native share is available (mainly mobile) — run only on client to keep SSR/CSR markup in sync
  useEffect(() => {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      setCanNativeShare(true);
    }
  }, []);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      trackEvent("Blog", "Share", "Copy Link");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [url]);

  const handleNativeShare = useCallback(async () => {
    if (!canNativeShare) return;

    try {
      await navigator.share({
        title,
        text: description || title,
        url,
      });
      trackEvent("Blog", "Share", "Native Share");
    } catch {
      // User cancelled or error - ignore
    }
  }, [canNativeShare, title, description, url]);

  const handleShareClick = (option: ShareOption) => {
    trackEvent("Blog", "Share", option.id);
  };

  if (variant === "floating") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-2 rounded-xl border border-white/10 bg-bg-primary/90 p-2 shadow-xl backdrop-blur-sm xl:flex"
      >
        {SHARE_OPTIONS.slice(0, 4).map((option) => (
          <a
            key={option.id}
            href={option.getUrl(url, title)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleShareClick(option)}
            className={`rounded-lg border border-transparent bg-white/5 p-2.5 transition-all ${option.color} ${option.hoverColor}`}
            aria-label={`Share on ${option.label}`}
            title={option.label}
          >
            {option.icon}
          </a>
        ))}
        <button
          onClick={handleCopyLink}
          className="rounded-lg border border-transparent bg-white/5 p-2.5 text-gray-400 transition-all hover:border-accent-primary/30 hover:bg-accent-primary/20 hover:text-accent-primary"
          aria-label="Copy link"
          title="Copy link"
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.span
                key="check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Check className="h-4 w-4 text-green-400" />
              </motion.span>
            ) : (
              <motion.span
                key="link"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Link2 className="h-4 w-4" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </motion.div>
    );
  }

  // Inline variant (default)
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="flex items-center gap-1.5 text-sm font-medium text-gray-400">
        <Share2 className="h-4 w-4" /> Share this article:
      </span>

      <div className="flex flex-wrap items-center gap-2">
        {/* Native share button for mobile */}
        {canNativeShare && (
          <button
            onClick={handleNativeShare}
            className="flex items-center gap-1.5 rounded-lg border border-accent-primary/30 bg-accent-primary/10 px-3 py-2 text-sm font-medium text-accent-primary transition-all hover:bg-accent-primary/20 sm:hidden"
          >
            <Share2 className="h-4 w-4" />
            Share
          </button>
        )}

        {/* Social share buttons */}
        {SHARE_OPTIONS.map((option) => (
          <a
            key={option.id}
            href={option.getUrl(url, title)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleShareClick(option)}
            className={`hidden rounded-lg border border-transparent bg-white/5 p-2.5 transition-all sm:block ${option.color} ${option.hoverColor}`}
            aria-label={`Share on ${option.label}`}
            title={option.label}
          >
            {option.icon}
          </a>
        ))}

        {/* Copy link button */}
        <button
          onClick={handleCopyLink}
          className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
            copied
              ? "border-green-500/30 bg-green-500/10 text-green-400"
              : "border-transparent bg-white/5 text-gray-400 hover:border-accent-primary/30 hover:bg-accent-primary/10 hover:text-accent-primary"
          }`}
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.span
                key="copied"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex items-center gap-1.5"
              >
                <Check className="h-4 w-4" />
                Copied!
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex items-center gap-1.5"
              >
                <Link2 className="h-4 w-4" />
                Copy Link
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );
}
