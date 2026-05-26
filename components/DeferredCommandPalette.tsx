'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const CommandPalette = dynamic(
  () => import('@/components/CommandPalette').then((mod) => mod.CommandPalette),
  {
    ssr: false,
    loading: () => null,
  }
);

type CommandPaletteWindow = Window & {
  __commandPaletteRequested?: boolean;
};

export function DeferredCommandPalette() {
  const [shouldMount, setShouldMount] = useState(false);

  useEffect(() => {
    const commandWindow = window as CommandPaletteWindow;

    const requestMount = () => {
      commandWindow.__commandPaletteRequested = true;
      setShouldMount(true);
    };

    const onGlobalOpen = () => {
      requestMount();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        requestMount();
      }
    };

    if (commandWindow.__commandPaletteRequested) {
      setShouldMount(true);
    }

    globalThis.addEventListener('command-palette:open', onGlobalOpen);
    document.addEventListener('keydown', onKeyDown, { capture: true });

    return () => {
      globalThis.removeEventListener('command-palette:open', onGlobalOpen);
      document.removeEventListener('keydown', onKeyDown, { capture: true });
    };
  }, []);

  if (!shouldMount) {
    return null;
  }

  return <CommandPalette />;
}
