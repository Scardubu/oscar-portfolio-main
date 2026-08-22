let runtimePromise:
  | Promise<{
      gsap: typeof import('gsap').gsap;
      ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger;
    }>
  | null = null;
let runtimeReady = false;

export function loadScrollCinemaRuntime() {
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.scrollCinemaRuntime = runtimeReady ? 'ready' : 'loading';
  }

  runtimePromise ??= Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
    .then(([{ gsap }, { ScrollTrigger }]) => {
      gsap.registerPlugin(ScrollTrigger);
      runtimeReady = true;
      if (typeof document !== 'undefined') {
        document.documentElement.dataset.scrollCinemaRuntime = 'ready';
      }
      return { gsap, ScrollTrigger };
    })
    .catch((error: unknown) => {
      runtimePromise = null;
      if (typeof document !== 'undefined') {
        document.documentElement.dataset.scrollCinemaRuntime = 'failed';
      }
      throw error;
    });

  return runtimePromise;
}
