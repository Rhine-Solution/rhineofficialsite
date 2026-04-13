import type { Meta, StoryObj } from '@storybook/react-vite';
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
  category: 'AI & ML',
  slug: 'ai-dashboard',
  technologies: ['React', 'TypeScript', 'TensorFlow', 'D3.js'],
  thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
};

export const Default: Story = {
  args: {
    ...sampleProject,
    variant: 'default',
  },
};

export const Featured: Story = {
  args: {
    ...sampleProject,
    title: 'Featured Project',
    variant: 'featured',
  },
};

export const Compact: Story = {
  args: {
    ...sampleProject,
    title: 'Compact View',
    variant: 'compact',
  },
};

export const NoImage: Story = {
  args: {
    ...sampleProject,
    thumbnail: undefined,
    variant: 'default',
  },
};