import type { Meta, StoryObj } from '@storybook/react';
import TeamCard from '../components/TeamCard';

const meta: Meta<typeof TeamCard> = {
  title: 'Components/TeamCard',
  component: TeamCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TeamCard>;

const sampleMember = {
  name: 'Dr. Sarah Chen',
  role: 'Chief Technology Officer',
  bio: 'PhD in Computer Science with 15+ years experience in distributed systems and AI.',
  linkedin: '#',
  twitter: '#',
};

export const Default: Story = {
  args: {
    member: sampleMember,
  },
};

export const WithImage: Story = {
  args: {
    member: {
      ...sampleMember,
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop',
    },
  },
};

export const LongBio: Story = {
  args: {
    member: {
      ...sampleMember,
      bio: 'Dr. Sarah Chen is a renowned expert in distributed systems and artificial intelligence. With a PhD from MIT and over 15 years of industry experience, she has led teams at major tech companies and contributed to numerous open-source projects.',
    },
  },
};