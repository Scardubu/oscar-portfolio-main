"use client";

import React, { ReactNode, useCallback, useMemo, useState } from "react";
import { Check, Copy, Hash } from "lucide-react";
import { trackEvent } from "@/app/lib/analytics";

interface CodeBlockClientProps {
  language?: string;
  filename?: string;
  children: ReactNode;
  showLineNumbers?: boolean;
}

const LANGUAGE_LABELS: Record<string, string> = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  python: "Python",
  bash: "Bash",
  sh: "Shell",
  jsx: "React JSX",
  tsx: "React TSX",
  json: "JSON",
  yaml: "YAML",
  yml: "YAML",
  sql: "SQL",
  dockerfile: "Dockerfile",
  css: "CSS",
  html: "HTML",
  markdown: "Markdown",
  md: "Markdown",
  rust: "Rust",
  go: "Go",
  java: "Java",
  cpp: "C++",
  c: "C",
  ruby: "Ruby",
  php: "PHP",
  swift: "Swift",
  kotlin: "Kotlin",
  scala: "Scala",
  r: "R",
  toml: "TOML",
  ini: "INI",
  xml: "XML",
  graphql: "GraphQL",
  prisma: "Prisma",
};

// Language-specific accent colors for visual distinction
const LANGUAGE_COLORS: Record<string, string> = {
  python: "from-yellow-500/20 to-blue-500/20 border-yellow-500/30",
  typescript: "from-blue-500/20 to-blue-600/20 border-blue-500/30",
  javascript: "from-yellow-400/20 to-yellow-500/20 border-yellow-500/30",
  bash: "from-green-500/20 to-green-600/20 border-green-500/30",
  sh: "from-green-500/20 to-green-600/20 border-green-500/30",
  json: "from-gray-500/20 to-gray-600/20 border-gray-500/30",
  sql: "from-orange-500/20 to-orange-600/20 border-orange-500/30",
  rust: "from-orange-600/20 to-red-500/20 border-orange-500/30",
  go: "from-cyan-500/20 to-cyan-600/20 border-cyan-500/30",
  dockerfile: "from-blue-400/20 to-blue-500/20 border-blue-400/30",
  yaml: "from-red-500/20 to-pink-500/20 border-red-500/30",
  yml: "from-red-500/20 to-pink-500/20 border-red-500/30",
  css: "from-blue-500/20 to-purple-500/20 border-blue-500/30",
  html: "from-orange-500/20 to-red-500/20 border-orange-500/30",
};

const LANGUAGE_BADGE_COLORS: Record<string, string> = {
  python: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  typescript: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  javascript: "bg-yellow-400/20 text-yellow-200 border-yellow-400/30",
  bash: "bg-green-500/20 text-green-300 border-green-500/30",
  sh: "bg-green-500/20 text-green-300 border-green-500/30",
  json: "bg-gray-500/20 text-gray-300 border-gray-500/30",
  sql: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  rust: "bg-orange-600/20 text-orange-300 border-orange-500/30",
  go: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  dockerfile: "bg-blue-400/20 text-blue-300 border-blue-400/30",
  yaml: "bg-red-500/20 text-red-300 border-red-500/30",
  yml: "bg-red-500/20 text-red-300 border-red-500/30",
  css: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  html: "bg-orange-500/20 text-orange-300 border-orange-500/30",
};

export function CodeBlockClient({
  language,
  filename,
  children,
  showLineNumbers: initialShowLines = false,
}: CodeBlockClientProps) {
  const [copied, setCopied] = useState(false);
  const [showLineNumbers, setShowLineNumbers] = useState(initialShowLines);

  const codeText = useMemo(
    () =>
      React.Children.toArray(children)
        .map((child) => (typeof child === "string" ? child : ""))
        .join(""),
    [children],
  );

  const lines = useMemo(() => {
    const splitLines = codeText.split(/\r?\n/);
    // Remove trailing empty line if present
    if (splitLines.length > 1 && splitLines[splitLines.length - 1] === "") {
      splitLines.pop();
    }
    return splitLines;
  }, [codeText]);

  const normalizedLanguage = (language || "text").toLowerCase();
  const displayLanguage = LANGUAGE_LABELS[normalizedLanguage] ||
    (normalizedLanguage === "text" ? "Code" : normalizedLanguage.toUpperCase());

  const headerGradient = LANGUAGE_COLORS[normalizedLanguage] || "from-white/5 to-white/[0.02] border-white/10";
  const badgeColor = LANGUAGE_BADGE_COLORS[normalizedLanguage] || "bg-white/10 text-gray-200 border-white/20";

  const handleCopy = useCallback(async () => {
    if (!codeText) return;

    try {
      await navigator.clipboard.writeText(codeText);
      setCopied(true);
      trackEvent("Blog", "CodeBlockCopy", filename || language || "unknown");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = codeText;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        trackEvent("Blog", "CodeBlockCopy", filename || language || "unknown");
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Silent fail
      }
      document.body.removeChild(textArea);
    }
  }, [codeText, filename, language]);

  const lineNumberWidth = lines.length >= 100 ? "w-12" : lines.length >= 10 ? "w-10" : "w-8";

  return (
    <div className="group my-6 overflow-hidden rounded-xl border border-white/10 bg-bg-secondary/80 shadow-lg transition-all hover:border-white/20 hover:shadow-xl">
      {/* Header bar with language badge and controls */}
      <div className={`flex items-center justify-between border-b bg-gradient-to-r px-4 py-2.5 ${headerGradient}`}>
        <div className="flex items-center gap-3">
          {/* Language badge */}
          <span className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${badgeColor}`}>
            <span className="h-2 w-2 rounded-full bg-current opacity-60" />
            {displayLanguage}
          </span>
          {/* Filename if provided */}
          {filename && (
            <span className="truncate text-xs text-gray-400 font-mono" title={filename}>
              {filename}
            </span>
          )}
        </div>

        {/* Control buttons */}
        <div className="flex items-center gap-1.5">
          {/* Line numbers toggle */}
          <button
            type="button"
            onClick={() => setShowLineNumbers((prev) => !prev)}
            className={`hidden items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium transition-all sm:inline-flex ${
              showLineNumbers
                ? "bg-accent-primary/20 text-accent-primary"
                : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-300"
            }`}
            aria-label={showLineNumbers ? "Hide line numbers" : "Show line numbers"}
          >
            <Hash className="h-3 w-3" />
            <span className="hidden md:inline">{showLineNumbers ? "Hide" : "Lines"}</span>
          </button>

          {/* Copy button */}
          <button
            type="button"
            onClick={handleCopy}
            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium transition-all ${
              copied
                ? "bg-green-500/20 text-green-400"
                : "bg-white/10 text-gray-300 hover:bg-accent-primary/20 hover:text-accent-primary"
            }`}
            aria-label={copied ? "Copied!" : "Copy code"}
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code content */}
      <div className="relative overflow-x-auto">
        <pre className="bg-bg-secondary p-4 text-sm leading-relaxed">
          {showLineNumbers ? (
            <code className="block font-mono">
              {lines.map((line, index) => (
                <div
                  key={index}
                  className="flex hover:bg-white/[0.02] transition-colors"
                >
                  <span
                    className={`select-none pr-4 text-right text-xs text-gray-500/60 ${lineNumberWidth} shrink-0 border-r border-white/5 mr-4`}
                    aria-hidden="true"
                  >
                    {index + 1}
                  </span>
                  <span className="flex-1 whitespace-pre text-gray-300">
                    {line || " "}
                  </span>
                </div>
              ))}
            </code>
          ) : (
            <code className="block whitespace-pre font-mono text-gray-300">
              {codeText}
            </code>
          )}
        </pre>

        {/* Subtle gradient overlay at bottom for long code blocks */}
        {lines.length > 15 && (
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-bg-secondary to-transparent" />
        )}
      </div>
    </div>
  );
}
