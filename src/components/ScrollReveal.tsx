import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade';
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
  className?: string;
  onReveal?: () => void;
}

export default function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  distance = 30,
  once = true,
  className = '',
  onReveal,
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);
   
  const [_isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const getInitialState = () => {
      switch (direction) {
        case 'up':
          return { opacity: 0, y: distance };
        case 'down':
          return { opacity: 0, y: -distance };
        case 'left':
          return { opacity: 0, x: -distance };
        case 'right':
          return { opacity: 0, x: distance };
        case 'scale':
          return { opacity: 0, scale: 0.9 };
        case 'fade':
        default:
          return { opacity: 0 };
      }
    };

    const getFinalState = () => {
      return { opacity: 1, x: 0, y: 0, scale: 1 };
    };

    gsap.set(element, getInitialState());

    const animation = gsap.to(element, {
      ...getFinalState(),
      duration,
      delay,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        end: 'bottom 20%',
        toggleActions: once
          ? 'play none none reverse'
          : 'play none none none',
        onEnter: () => {
          setIsVisible(true);
          onReveal?.();
        },
      },
    });

    return () => {
      animation.kill();
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === element) {
          trigger.kill();
        }
      });
    };
  }, [direction, delay, duration, distance, once, onReveal]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}

interface StaggerRevealProps {
  children: React.ReactNode[];
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale';
  stagger?: number;
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
}

export function StaggerReveal({
  children,
  direction = 'up',
  stagger = 0.1,
  delay = 0,
  duration = 0.5,
  distance = 20,
  className = '',
}: StaggerRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const children = container.children;
    const getInitialState = () => {
      switch (direction) {
        case 'up':
          return { opacity: 0, y: distance };
        case 'down':
          return { opacity: 0, y: -distance };
        case 'left':
          return { opacity: 0, x: -distance };
        case 'right':
          return { opacity: 0, x: distance };
        case 'scale':
          return { opacity: 0, scale: 0.9 };
        default:
          return { opacity: 0, y: distance };
      }
    };

    gsap.set(children, getInitialState());

    const animation = gsap.to(children, {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      duration,
      stagger,
      delay,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: container,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    });

    return () => {
      animation.kill();
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === container) {
          trigger.kill();
        }
      });
    };
  }, [direction, stagger, delay, duration, distance]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}

interface ParallaxSectionProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

export function ParallaxSection({
  children,
  speed = 0.5,
  className = '',
}: ParallaxSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const animation = gsap.to(section, {
      y: () => window.innerHeight * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    return () => {
      animation.kill();
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === section) {
          trigger.kill();
        }
      });
    };
  }, [speed]);

  return (
    <div ref={sectionRef} className={className}>
      {children}
    </div>
  );
}