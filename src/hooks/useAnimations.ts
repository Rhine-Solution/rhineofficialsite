import { useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useGsapInit() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);
}

export function useFadeIn(delay = 0) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    gsap.fromTo(
      element,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    return () => {
      gsap.killTweensOf(element);
    };
  }, [delay]);

  return elementRef;
}

export function useStaggerFadeIn(items: number, stagger = 0.1, containerRef?: React.RefObject<HTMLElement>) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const children = element.children;
    gsap.fromTo(
      children,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    return () => {
      gsap.killTweensOf(children);
    };
  }, [items, stagger]);

  return ref;
}

export function useScaleHover() {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleMouseEnter = () => {
      gsap.to(element, {
        scale: 1.02,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      gsap.killTweensOf(element);
    };
  }, []);

  return elementRef;
}

export function useParallax(speed = 0.5) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    gsap.to(element, {
      y: () => window.innerHeight * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    return () => {
      gsap.killTweensOf(element);
    };
  }, [speed]);

  return elementRef;
}

export function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    gsap.fromTo(
      element,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    return () => {
      gsap.killTweensOf(element);
    };
  }, []);

  return ref;
}

export function useTextReveal() {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const text = element.textContent || '';
    element.textContent = '';

    const chars = text.split('').map((char) =>
      char === ' ' ? '\u00A0' : char
    );

    chars.forEach((char, i) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.style.display = 'inline-block';
      span.style.opacity = '0';
      span.style.transform = 'translateY(20px)';
      element.appendChild(span);
    });

    gsap.to(element.children, {
      opacity: 1,
      y: 0,
      duration: 0.05,
      stagger: 0.02,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    });

    return () => {
      gsap.killTweensOf(element.children);
      if (element.textContent !== text) {
        element.textContent = text;
      }
    };
  }, []);

  return ref;
}

export function useGlowPulse() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    gsap.to(element, {
      boxShadow: '0 0 30px rgba(0, 130, 216, 0.5)',
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    return () => {
      gsap.killTweensOf(element);
    };
  }, []);

  return ref;
}

export function useShimmer() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    gsap.fromTo(
      element,
      { backgroundPosition: '-200% 0' },
      {
        backgroundPosition: '200% 0',
        duration: 1.5,
        repeat: -1,
        ease: 'linear',
      }
    );

    return () => {
      gsap.killTweensOf(element);
    };
  }, []);

  return ref;
}

export function useMagneticButton() {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(element, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)',
      });
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
      gsap.killTweensOf(element);
    };
  }, []);

  return ref;
}

export function animateOnMount(duration = 0.5) {
  return gsap.fromTo(
    '.page-enter',
    { opacity: 0, y: 10 },
    { opacity: 1, y: 0, duration, ease: 'power2.out' }
  );
}

export function animatePageExit(callback: () => void, duration = 0.2) {
  gsap.to('.page-exit', {
    opacity: 0,
    y: -10,
    duration,
    ease: 'power2.in',
    onComplete: callback,
  });
}

export const animations = {
  fadeIn: (element: Element) => {
    gsap.fromTo(element, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
  },
  slideUp: (element: Element, delay = 0) => {
    gsap.fromTo(element, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.5, delay, ease: 'power2.out' });
  },
  scaleIn: (element: Element) => {
    gsap.fromTo(element, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.7)' });
  },
  stagger: (elements: Element[], stagger = 0.1) => {
    gsap.fromTo(elements, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, stagger, ease: 'power2.out' });
  },
  glow: (element: Element) => {
    gsap.to(element, { boxShadow: '0 0 20px rgba(0, 130, 216, 0.4)', duration: 0.3, yoyo: true, repeat: 1 });
  },
};

export default {
  useGsapInit,
  useFadeIn,
  useStaggerFadeIn,
  useScaleHover,
  useParallax,
  useScrollReveal,
  useTextReveal,
  useGlowPulse,
  useShimmer,
  useMagneticButton,
  animateOnMount,
  animatePageExit,
  animations,
};