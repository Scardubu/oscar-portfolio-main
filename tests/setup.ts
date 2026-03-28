import '@testing-library/jest-dom';

// Global test setup (Phase 7)

// Mock IntersectionObserver for Framer Motion
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = "0px";
  readonly thresholds: ReadonlyArray<number> = [0];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(callback?: IntersectionObserverCallback, options?: IntersectionObserverInit) {}

  disconnect(): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  observe(target: Element): void {}

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  unobserve(target: Element): void {}
}

// Assign mock to global scope
global.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;

// Mock window.matchMedia for responsive tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});
