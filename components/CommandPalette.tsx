'use client';

import { AnimatePresence, m } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useReducedMotion } from '@/hooks/useReducedMotion';
import { springConfig } from '@/lib/motion';

interface CommandItem {
  id: string;
  label: string;
  shortcut?: string;
  action: () => void;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setActiveIndex(0);
  }, []);

  const scrollToSection = useCallback(
    (sectionId: string) => {
      if (pathname !== '/') {
        router.push(`/#${sectionId}`);
        close();
        return;
      }

      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      close();
    },
    [close, pathname, router]
  );

  const commands = useMemo<CommandItem[]>(
    () => [
      { id: 'projects', label: 'Go to Projects', action: () => scrollToSection('projects') },
      { id: 'about', label: 'Go to About', action: () => scrollToSection('about') },
      { id: 'writing', label: 'Go to Writing', action: () => scrollToSection('writing') },
      { id: 'contact', label: 'Go to Contact', action: () => scrollToSection('contact') },
      {
        id: 'sabiscore',
        label: 'Open SabiScore case study',
        action: () => router.push('/work/sabiscore'),
      },
      {
        id: 'hashablanca',
        label: 'Open Hashablanca case study',
        action: () => router.push('/work/hashablanca'),
      },
      { id: 'writing-index', label: 'Open Writing index', action: () => router.push('/writing') },
      {
        id: 'resume',
        label: 'Open resume',
        shortcut: 'R',
        action: () => {
          window.open('/oscar-scardubu-resume.pdf', '_blank', 'noopener,noreferrer');
        },
      },
      {
        id: 'email',
        label: 'Send email',
        shortcut: 'E',
        action: () => {
          window.location.href = 'mailto:oscar@scardubu.dev';
        },
      },
    ],
    [router, scrollToSection]
  );

  const filteredCommands = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return commands;
    }

    return commands.filter((command) => command.label.toLowerCase().includes(normalizedQuery));
  }, [commands, query]);

  const executeCommand = useCallback(
    (command: CommandItem) => {
      command.action();
      close();
    },
    [close]
  );

  useEffect(() => {
    const toggle = () => setOpen((current) => !current);
    const openPalette = () => setOpen(true);

    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        toggle();
        return;
      }

      if (!open) {
        return;
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        return;
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setActiveIndex((current) =>
          Math.min(current + 1, Math.max(filteredCommands.length - 1, 0))
        );
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setActiveIndex((current) => Math.max(current - 1, 0));
      }

      if (event.key === 'Enter' && filteredCommands[activeIndex]) {
        event.preventDefault();
        executeCommand(filteredCommands[activeIndex]);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('command-palette:open', openPalette);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('command-palette:open', openPalette);
    };
  }, [activeIndex, close, executeCommand, filteredCommands, open]);

  useEffect(() => {
    if (open) {
      window.setTimeout(() => inputRef.current?.focus(), 40);
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  return (
    <AnimatePresence>
      {open ? (
        <m.div
          className="cmd-overlay"
          initial={reducedMotion ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reducedMotion ? {} : { opacity: 0 }}
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
        >
          <m.div
            className="cmd-panel glass glass-full"
            initial={reducedMotion ? {} : { opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? {} : { opacity: 0, y: -8, scale: 0.98 }}
            transition={springConfig}
            onClick={(event) => event.stopPropagation()}
          >
            <input
              ref={inputRef}
              className="cmd-input"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search or jump to…"
              aria-label="Command search"
              autoComplete="off"
            />

            <div role="listbox" aria-label="Commands">
              {filteredCommands.length === 0 ? (
                <div className="cmd-item" style={{ color: 'var(--color-text-muted)' }}>
                  No results for “{query}”
                </div>
              ) : null}

              {filteredCommands.map((command, index) => (
                <div
                  key={command.id}
                  className="cmd-item"
                  role="option"
                  aria-selected={index === activeIndex}
                  data-active={index === activeIndex}
                  onClick={() => executeCommand(command)}
                  onMouseEnter={() => setActiveIndex(index)}
                >
                  {command.label}
                  {command.shortcut ? <kbd>{command.shortcut}</kbd> : null}
                </div>
              ))}
            </div>
          </m.div>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}
