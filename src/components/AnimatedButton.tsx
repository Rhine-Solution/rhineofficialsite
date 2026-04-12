import React, { useRef, useState } from 'react';
import gsap from 'gsap';

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  glowOnHover?: boolean;
  magnetic?: boolean;
}

export default function AnimatedButton({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  glowOnHover = true,
  magnetic = false,
  className = '',
  ...props
}: AnimatedButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const baseClasses = 'relative inline-flex items-center justify-center font-semibold uppercase tracking-wider transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-brand-primary text-white hover:bg-brand-primary/90 focus:ring-brand-primary',
    secondary: 'bg-white/10 text-white border border-white/20 hover:bg-white/20 focus:ring-white/30',
    outline: 'border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white',
    ghost: 'text-white/70 hover:text-white hover:bg-white/10',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs rounded-lg',
    md: 'px-5 py-2.5 text-sm rounded-xl',
    lg: 'px-8 py-4 text-base rounded-2xl',
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (glowOnHover && buttonRef.current) {
      gsap.to(buttonRef.current, {
        boxShadow: '0 0 20px rgba(0, 130, 216, 0.4)',
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (glowOnHover && buttonRef.current) {
      gsap.to(buttonRef.current, {
        boxShadow: 'none',
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!magnetic || !buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(buttonRef.current, {
      x: x * 0.15,
      y: y * 0.15,
      duration: 0.2,
      ease: 'power2.out',
    });
  };

   
  const _handleMouseLeaveButton = () => {
    setIsHovered(false);
  };

  const handleBlur = () => {
    if (!magnetic || !buttonRef.current) return;

    gsap.to(buttonRef.current, {
      x: 0,
      y: 0,
      duration: 0.4,
      ease: 'elastic.out(1, 0.3)',
    });
    setIsHovered(false);
  };

  return (
    <button
      ref={buttonRef}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={magnetic ? handleMouseMove : undefined}
      onBlur={magnetic ? handleBlur : undefined}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">
        {icon && iconPosition === 'left' && (
          <span className={`transition-transform duration-300 ${isHovered ? '-translate-x-1' : ''}`}>
            {icon}
          </span>
        )}
        {children}
        {icon && iconPosition === 'right' && (
          <span className={`transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}>
            {icon}
          </span>
        )}
      </span>

      {/* Shine effect */}
      <span
        className="absolute inset-0 overflow-hidden rounded-inherit pointer-events-none"
        style={{ borderRadius: 'inherit' }}
      >
        <span
          className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full ${
            isHovered ? 'animate-shine' : ''
          }`}
        />
      </span>
    </button>
  );
}

export function AnimatedIconButton({
  children,
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(buttonRef.current, {
      x: x * 0.1,
      y: y * 0.1,
      duration: 0.2,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    if (!buttonRef.current) return;

    gsap.to(buttonRef.current, {
      x: 0,
      y: 0,
      duration: 0.4,
      ease: 'elastic.out(1, 0.3)',
    });
  };

  return (
    <button
      ref={buttonRef}
      className={`p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all duration-300 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </button>
  );
}