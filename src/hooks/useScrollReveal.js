import { useEffect, useRef } from 'react';

/**
 * Lightweight IntersectionObserver-based scroll-reveal hook.
 * Adds the 'in-view' class to elements with the 'reveal' class
 * once they enter the viewport.
 */
export function useScrollReveal(containerRef) {
  useEffect(() => {
    const root = containerRef?.current ?? document;
    const elements = root.querySelectorAll('.reveal');

    if (typeof IntersectionObserver === 'undefined') {
      elements.forEach((el) => el.classList.add('in-view'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px 50px 0px' }
    );

    elements.forEach((el) => {
      // If already in or near viewport, immediately reveal
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 100) {
        el.classList.add('in-view');
      } else {
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, [containerRef]);
}
