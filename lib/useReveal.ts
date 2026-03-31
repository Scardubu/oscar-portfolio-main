import { useEffect, useRef } from 'react';

export function useReveal<T extends HTMLElement = HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add('visible');
          observer.unobserve(element);
        }
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}
