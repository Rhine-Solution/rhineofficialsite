import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Skeleton } from '../components/ui/Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'UI/AnimatedButton',
  component: Skeleton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    animation: {
      control: 'select',
      options: ['pulse', 'wave', 'none'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  args: {
    children: 'Click Me',
    variant: 'primary',
  },
};

export const Loading: Story = {
  args: {
    children: 'Loading...',
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    disabled: true,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Skeleton variant="text" className="px-4 py-2">Primary</Skeleton>
      <Skeleton variant="text" className="px-4 py-2">Secondary</Skeleton>
      <Skeleton variant="text" className="px-4 py-2">Outline</Skeleton>
      <Skeleton variant="text" className="px-4 py-2">Ghost</Skeleton>
    </div>
  ),
};
