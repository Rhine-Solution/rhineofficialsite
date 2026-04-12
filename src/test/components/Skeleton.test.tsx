import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Skeleton, SkeletonCard, SkeletonGrid } from '../../components/ui/Skeleton';

describe('Skeleton', () => {
  it('renders with correct variant classes', () => {
    const { rerender } = render(<Skeleton variant="text" />);
    expect(screen.getByRole('status')).toHaveClass('rounded');

    rerender(<Skeleton variant="circular" />);
    expect(screen.getByRole('status')).toHaveClass('rounded-full');

    rerender(<Skeleton variant="rectangular" />);
    expect(screen.getByRole('status')).toHaveClass('rounded-lg');
  });

  it('applies custom width and height', () => {
    render(<Skeleton width={200} height={100} />);
    const skeleton = screen.getByRole('status');
    expect(skeleton).toHaveStyle({ width: '200px', height: '100px' });
  });

  it('renders multiple skeletons when count > 1', () => {
    render(<Skeleton count={3} />);
    const skeletons = screen.getAllByRole('status');
    expect(skeletons).toHaveLength(3);
  });

  it('has pulse animation by default', () => {
    render(<Skeleton />);
    expect(screen.getByRole('status')).toHaveClass('animate-pulse');
  });

  it('can disable animation', () => {
    render(<Skeleton animation="none" />);
    expect(screen.getByRole('status')).not.toHaveClass('animate-pulse');
  });
});

describe('SkeletonCard', () => {
  it('renders with default props', () => {
    render(<SkeletonCard />);
    expect(screen.getAllByRole('status').length).toBeGreaterThan(0);
  });

  it('renders correct number of lines', () => {
    render(<SkeletonCard lines={5} />);
    const skeletons = screen.getAllByRole('status');
    expect(skeletons.length).toBeGreaterThanOrEqual(5);
  });

  it('can hide avatar', () => {
    const { container } = render(<SkeletonCard showAvatar={false} />);
    const circularSkeletons = container.querySelectorAll('.rounded-full');
    expect(circularSkeletons.length).toBe(0);
  });

  it('can show image', () => {
    const { container } = render(<SkeletonCard showImage />);
    const rectangularSkeletons = container.querySelectorAll('.rounded-lg');
    expect(rectangularSkeletons.length).toBeGreaterThan(0);
  });
});

describe('SkeletonGrid', () => {
  it('renders correct number of cards', () => {
    render(<SkeletonGrid count={6} />);
    const statusElements = screen.getAllByRole('status');
    expect(statusElements.length).toBeGreaterThanOrEqual(6);
  });
});
