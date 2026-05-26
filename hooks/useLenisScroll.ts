'use client';

import type Lenis from 'lenis';
import { useEffect, useRef, type MutableRefObject } from 'react';

import { useScrollCinema } from '@/components/cinematic/ScrollCinemaProvider';

type ScrollSubscriber = () => void;

const subscribers = new Set<ScrollSubscriber>();

let activeEngine: 'lenis' | 'window' | null = null;
let activeLenis: Lenis | null = null;
let detachSource: (() => void) | null = null;
let sourceObserver: MutationObserver | null = null;

function emitScroll() {
  subscribers.forEach((subscriber) => subscriber());
}

function teardownSource() {
  detachSource?.();
  detachSource = null;
  activeEngine = null;
  activeLenis = null;
}

function attachWindowSource() {
  const onScroll = () => emitScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  detachSource = () => {
    window.removeEventListener('scroll', onScroll);
  };
  activeEngine = 'window';
}

function syncScrollSource(lenisRef: MutableRefObject<Lenis | null>) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  if (subscribers.size === 0) {
    teardownSource();
    sourceObserver?.disconnect();
    sourceObserver = null;
    return;
  }

  const nextLenis = lenisRef.current;
  const scrollEngine = document.documentElement.dataset.scrollEngine;

  if (scrollEngine === 'lenis' && nextLenis) {
    if (activeEngine === 'lenis' && activeLenis === nextLenis) {
      return;
    }

    teardownSource();
    nextLenis.on('scroll', emitScroll);
    detachSource = () => {
      nextLenis.off('scroll', emitScroll);
    };
    activeEngine = 'lenis';
    activeLenis = nextLenis;
    return;
  }

  if (activeEngine === 'window') {
    return;
  }

  teardownSource();
  attachWindowSource();
}

function ensureSourceObserver(lenisRef: MutableRefObject<Lenis | null>) {
  if (sourceObserver || typeof document === 'undefined') return;

  sourceObserver = new MutationObserver(() => {
    syncScrollSource(lenisRef);
  });

  sourceObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-scroll-engine'],
  });
}

export function useLenisScroll(callback: () => void) {
  const { lenisRef } = useScrollCinema();
  const callbackRef = useRef(callback);

  callbackRef.current = callback;

  useEffect(() => {
    const subscriber = () => {
      callbackRef.current();
    };

    subscribers.add(subscriber);
    ensureSourceObserver(lenisRef);
    syncScrollSource(lenisRef);

    return () => {
      subscribers.delete(subscriber);
      syncScrollSource(lenisRef);
      if (subscribers.size === 0) {
        sourceObserver?.disconnect();
        sourceObserver = null;
      }
    };
  }, [lenisRef]);

  useEffect(() => {
    callbackRef.current();
  }, [callback]);
}
