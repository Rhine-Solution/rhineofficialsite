import React from 'react';

type Variant = 'ghost' | 'primary';

interface Props {
  children: React.ReactNode;
  onClick?: (e?: React.MouseEvent) => void;
  variant?: Variant;
  themeColor?: string; // CSS color string (hex or named)
  className?: string;
  ariaLabel?: string;
}

function hexToRgba(hex: string, alpha = 1) {
  const h = hex.replace('#', '');
  const bigint = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function AuthButton({ children, onClick, variant = 'ghost', themeColor = '#4f46e5', className = '', ariaLabel }: Props) {
  const base = 'inline-flex items-center justify-center rounded-full font-medium transition-colors';

  if (variant === 'primary') {
    // create a subtle gradient using themeColor if it's hex
    let style: React.CSSProperties | undefined = undefined;
    if (themeColor && themeColor.startsWith('#')) {
      const left = hexToRgba(themeColor, 1);
      const right = hexToRgba(themeColor, 0.85);
      style = { backgroundImage: `linear-gradient(90deg, ${left}, ${right})` };
    }
    return (
      <button
        onClick={onClick}
        aria-label={ariaLabel}
        className={`${base} px-4 py-1.5 text-sm text-white shadow-sm ${className}`}
        style={style}
      >
        {children}
      </button>
    );
  }

  // ghost
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={`${base} px-3 py-1.5 text-sm text-white/90 bg-white/5 hover:bg-white/10 ${className}`}
    >
      {children}
    </button>
  );
}
