import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { OptimizedImage } from '../components/ui/OptimizedImage';

const meta: Meta<typeof OptimizedImage> = {
  title: 'UI/OptimizedImage',
  component: OptimizedImage,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof OptimizedImage>;

const sampleImage = 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop';

export const Default: Story = {
  args: {
    src: sampleImage,
    alt: 'Sample image',
    className: 'w-64 h-48',
  },
};

export const WithPlaceholder: Story = {
  args: {
    src: sampleImage,
    alt: 'Sample image with placeholder',
    className: 'w-64 h-48',
    placeholder: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3Crect fill="%23333"/%3E%3C/svg%3E',
  },
};

export const EagerLoading: Story = {
  args: {
    src: sampleImage,
    alt: 'Eager loaded image',
    className: 'w-64 h-48',
    loading: 'eager',
  },
};
