import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import AnimatedButton from '../components/AnimatedButton';

beforeEach(cleanup);

describe('AnimatedButton', () => {
  it('renders with children', () => {
    render(<AnimatedButton>Click me</AnimatedButton>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('renders primary variant', () => {
    render(<AnimatedButton variant="primary">Primary</AnimatedButton>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders small size', () => {
    render(<AnimatedButton size="sm">Small</AnimatedButton>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders large size', () => {
    render(<AnimatedButton size="lg">Large</AnimatedButton>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<AnimatedButton onClick={handleClick}>Click me</AnimatedButton>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('can be disabled', () => {
    render(<AnimatedButton disabled>Disabled</AnimatedButton>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});