import type { Meta, StoryObj } from '@storybook/react';
import BlogCard from '../components/BlogCard';

const meta: Meta<typeof BlogCard> = {
  title: 'Components/BlogCard',
  component: BlogCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BlogCard>;

const samplePost = {
  title: 'The Future of AI in Enterprise Software',
  excerpt: 'Explore how artificial intelligence is transforming enterprise software development and what it means for your business.',
  date: '2024-03-15',
  author: 'Alex Chen',
  category: 'AI & Machine Learning',
  readTime: '8 min read',
  image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop',
  slug: 'future-of-ai-enterprise',
};

export const Default: Story = {
  args: {
    post: samplePost,
  },
};

export const NoImage: Story = {
  args: {
    post: { ...samplePost, image: undefined },
  },
};

export const LongTitle: Story = {
  args: {
    post: {
      ...samplePost,
      title: 'Building Scalable Microservices Architecture with Kubernetes and Docker in Production Environments',
    },
  },
};