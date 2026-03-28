"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

const shortcuts = [
  { key: "h", label: "Home", action: () => (window.location.href = "/") },
  { key: "p", label: "Projects", action: () => (window.location.href = "/#projects") },
  { key: "s", label: "Skills", action: () => (window.location.href = "/#skills") },
  { key: "b", label: "Blog", action: () => (window.location.href = "/blog") },
  { key: "c", label: "Contact", action: () => (window.location.href = "/#contact") },
  { key: "g", label: "GitHub", action: () => window.open("https://github.com/scardubu", "_blank") },
];

export function KeyboardShortcuts() {
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) {
        return;
      }

      if (e.key === "?") {
        e.preventDefault();
        setShowHelp(true);
        return;
      }

      if (e.key === "Escape" && showHelp) {
        setShowHelp(false);
        return;
      }

      const shortcut = shortcuts.find((s) => s.key === e.key.toLowerCase());
      if (shortcut) {
        e.preventDefault();
        shortcut.action();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [showHelp]);

  return (
    <>
      {showHelp && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setShowHelp(false)}
        >
          <div
            className="w-full max-w-md rounded-lg border border-[#00d9ff]/30 bg-gray-900 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#00d9ff]">Keyboard Shortcuts</h3>
              <button
                onClick={() => setShowHelp(false)}
                className="text-gray-400 transition-colors hover:text-white"
                aria-label="Close shortcuts help"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-2">
              {shortcuts.map((shortcut) => (
                <div
                  key={shortcut.key}
                  className="flex items-center justify-between border-b border-gray-800 py-2 last:border-0"
                >
                  <span className="text-gray-300">{shortcut.label}</span>
                  <kbd className="rounded border border-gray-700 bg-gray-800 px-2 py-1 font-mono text-xs">
                    {shortcut.key.toUpperCase()}
                  </kbd>
                </div>
              ))}
            </div>

            <p className="mt-4 text-xs italic text-gray-500">
              Shortcuts work anywhere except form inputs
            </p>
          </div>
        </div>
      )}

      <button
        onClick={() => setShowHelp(true)}
        className="fixed bottom-4 right-4 z-[9999] rounded-lg border border-[#00d9ff]/30 bg-gray-900/80 px-3 py-2 text-xs text-gray-400 transition-all hover:text-[#00d9ff]"
        aria-label="Show keyboard shortcuts"
      >
        Press <kbd className="rounded bg-gray-800 px-1 py-0.5">?</kbd> for shortcuts
      </button>
    </>
  );
}
