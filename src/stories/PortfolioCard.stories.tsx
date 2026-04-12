import type { Meta, StoryObj } from '@storybook/react';
import PortfolioCard from '../components/PortfolioCard';

const meta: Meta<typeof PortfolioCard> = {
  title: 'Components/PortfolioCard',
  component: PortfolioCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'featured', 'compact'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof PortfolioCard>;

const sampleProject = {
  title: 'AI-Powered Dashboard',
  description: 'A real-time analytics dashboard with machine learning predictions and interactive visualizations.',
  tags: ['React', 'TypeScript', 'TensorFlow', 'D3.js'],
  image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
  link: '#',
};

export const Default: Story = {
  args: {
    project: sampleProject,
    variant: 'default',
  },
};

export const Featured: Story = {
  args: {
    project: { ...sampleProject, title: 'Featured Project' },
    variant: 'featured',
  },
};

export const Compact: Story = {
  args: {
    project: { ...sampleProject, title: 'Compact View' },
    variant: 'compact',
  },
};

export const NoImage: Story = {
  args: {
    project: { ...sampleProject, image: undefined },
    variant: 'default',
  },
};