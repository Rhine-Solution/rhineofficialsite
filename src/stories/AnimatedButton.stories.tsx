import type { Meta, StoryObj } from '@storybook/react';
import AnimatedButton from '../components/AnimatedButton';

const meta: Meta<typeof AnimatedButton> = {
  title: 'Components/AnimatedButton',
  component: AnimatedButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof AnimatedButton>;

export const Primary: Story = {
  args: {
    children: 'Get Started',
    variant: 'primary',
    onClick: () => console.log('clicked'),
  },
};

export const Secondary: Story = {
  args: {
    children: 'Learn More',
    variant: 'secondary',
    onClick: () => console.log('clicked'),
  },
};

export const Outline: Story = {
  args: {
    children: 'View Details',
    variant: 'outline',
    onClick: () => console.log('clicked'),
  },
};

export const Small: Story = {
  args: {
    children: 'Small Button',
    size: 'sm',
    onClick: () => console.log('clicked'),
  },
};

export const Large: Story = {
  args: {
    children: 'Large Button',
    size: 'lg',
    onClick: () => console.log('clicked'),
  },
};

export const Loading: Story = {
  args: {
    children: 'Loading...',
    loading: true,
    onClick: () => console.log('clicked'),
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    disabled: true,
    onClick: () => console.log('clicked'),
  },
};