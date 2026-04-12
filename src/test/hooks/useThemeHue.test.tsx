import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useThemeHue from '../../hooks/useThemeHue';

describe('useThemeHue', () => {
  const originalMatchMedia = window.matchMedia;
  
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: originalMatchMedia,
    });
  });

  it('should initialize with default hue of 0', () => {
    const { result } = renderHook(() => useThemeHue());
    expect(result.current.hue).toBe(0);
  });

  it('should return theme color based on hue', () => {
    const { result } = renderHook(() => useThemeHue());
    expect(result.current.themeColor).toContain('hsl(0');
  });

  it('should update hue when setHue is called', () => {
    const { result } = renderHook(() => useThemeHue());
    
    act(() => {
      result.current.setHue(120);
    });

    expect(result.current.hue).toBe(120);
    expect(result.current.themeColor).toContain('hsl(120');
  });

  it('should rotate hue back to 0 after 360', () => {
    const { result } = renderHook(() => useThemeHue());
    
    act(() => {
      result.current.setHue(400);
    });

    expect(result.current.hue).toBe(40);
  });

  it('should handle negative hue values', () => {
    const { result } = renderHook(() => useThemeHue());
    
    act(() => {
      result.current.setHue(-50);
    });

    expect(result.current.hue).toBe(310);
  });
});
