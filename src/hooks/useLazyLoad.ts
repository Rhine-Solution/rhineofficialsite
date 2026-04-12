import { useEffect, useRef, useState, useCallback } from 'react';

interface LazyLoadOptions {
  rootMargin?: string;
  threshold?: number;
  triggerOnce?: boolean;
}

export function useLazyLoad(options: LazyLoadOptions = {}) {
  const { rootMargin = '100px', threshold = 0, triggerOnce = true } = options;
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (triggerOnce) {
              observer.disconnect();
            }
          } else if (!triggerOnce) {
            setIsVisible(false);
          }
        });
      },
      { rootMargin, threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [rootMargin, threshold, triggerOnce]);

  return { ref, isVisible };
}

export function usePrefetch() {
  const prefetch = useCallback((url: string) => {
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      (window as Window & { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(() => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        link.as = 'document';
        document.head.appendChild(link);
      });
    }
  }, []);

  return { prefetch };
}

export function useIntersectionObserver(
  callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit = {}
) {
  const [ref, setRef] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(callback);
    }, options);

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, callback, options]);

  return setRef;
}

export default useLazyLoad;
