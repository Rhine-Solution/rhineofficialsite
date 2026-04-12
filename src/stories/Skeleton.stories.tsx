import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton, SkeletonCard, SkeletonTable, SkeletonGrid } from '../components/ui/Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'UI/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Text: Story = {
  args: {
    variant: 'text',
    width: '100%',
    height: 16,
  },
};

export const Circular: Story = {
  args: {
    variant: 'circular',
    width: 48,
    height: 48,
  },
};

export const Rectangular: Story = {
  args: {
    variant: 'rectangular',
    width: 200,
    height: 100,
  },
};

export const Multiple: Story = {
  args: {
    variant: 'text',
    count: 3,
    height: 14,
  },
};

export const Card: Story = {
  render: () => <SkeletonCard lines={4} showAvatar showImage />,
};

export const Table: Story = {
  render: () => <SkeletonTable rows={5} columns={4} />,
};

export const Grid: Story = {
  render: () => <SkeletonGrid count={6} columns={3} />,
};
