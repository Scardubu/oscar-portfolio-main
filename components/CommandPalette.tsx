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
  const openRef = useRef(open);
  const activeIndexRef = useRef(activeIndex);
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
          globalThis.location.href = 'mailto:oscar@scardubu.dev';
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
  const filteredCommandsRef = useRef(filteredCommands);

  openRef.current = open;
  activeIndexRef.current = activeIndex;
  filteredCommandsRef.current = filteredCommands;

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

      if (!openRef.current) {
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
          Math.min(current + 1, Math.max(filteredCommandsRef.current.length - 1, 0))
        );
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setActiveIndex((current) => Math.max(current - 1, 0));
      }

      const selectedCommand = filteredCommandsRef.current[activeIndexRef.current];

      if (event.key === 'Enter' && selectedCommand) {
        event.preventDefault();
        executeCommand(selectedCommand);
      }
    };

    globalThis.addEventListener('keydown', onKeyDown);
    globalThis.addEventListener('command-palette:open', openPalette);

    return () => {
      globalThis.removeEventListener('keydown', onKeyDown);
      globalThis.removeEventListener('command-palette:open', openPalette);
    };
  }, [close, executeCommand]);

  useEffect(() => {
    if (open) {
      globalThis.setTimeout(() => inputRef.current?.focus(), 40);
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

            <ul className="py-2" aria-label="Commands">
              {filteredCommands.length === 0 ? (
                <li className="cmd-item cmd-item-muted">No results for “{query}”</li>
              ) : null}

              {filteredCommands.map((command, index) => (
                <li key={command.id}>
                  <button
                    type="button"
                    className="cmd-item w-full"
                    data-active={index === activeIndex}
                    onClick={() => executeCommand(command)}
                    onMouseEnter={() => setActiveIndex(index)}
                  >
                    {command.label}
                    {command.shortcut ? <kbd>{command.shortcut}</kbd> : null}
                  </button>
                </li>
              ))}
            </ul>
          </m.div>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}
