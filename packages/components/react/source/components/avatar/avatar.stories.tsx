import { CircleHelp, UserRound } from 'lucide-react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from './avatar.js';

const avatarSizes = ['small', 'medium', 'large', 'extra-large'] as const;

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  args: {
    size: 'medium',
  },
  argTypes: {
    size: {
      control: 'select',
      options: avatarSizes,
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomImage: Story = {
  render: () => (
    <Avatar>
      <Avatar.Image src="https://i.pravatar.cc/120?img=12" alt="Max Perez" />
      <Avatar.Fallback>MX</Avatar.Fallback>
    </Avatar>
  ),
};

export const InitialsFallback: Story = {
  render: () => (
    <Avatar>
      <Avatar.Fallback>AP</Avatar.Fallback>
    </Avatar>
  ),
};

export const IconFallback: Story = {
  render: () => (
    <Avatar>
      <Avatar.Fallback>
        <UserRound aria-hidden="true" />
      </Avatar.Fallback>
    </Avatar>
  ),
};

export const CustomFallbackContent: Story = {
  render: () => (
    <Avatar size="large">
      <Avatar.Fallback>
        <CircleHelp aria-hidden="true" />
        <span>?</span>
      </Avatar.Fallback>
    </Avatar>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      {avatarSizes.map((size) => (
        <Avatar key={size} size={size} aria-label={`${size} avatar`}>
          <Avatar.Fallback>
            {size === 'extra-large' ? 'XL' : size.slice(0, 2).toUpperCase()}
          </Avatar.Fallback>
        </Avatar>
      ))}
    </div>
  ),
};

export const MissingImage: Story = {
  render: () => (
    <Avatar>
      <Avatar.Image alt="Jamie Chen" />
      <Avatar.Fallback>JC</Avatar.Fallback>
    </Avatar>
  ),
};

export const FailedImage: Story = {
  render: () => (
    <Avatar>
      <Avatar.Image src="/missing-avatar.png" alt="Riley Smith" />
      <Avatar.Fallback>RS</Avatar.Fallback>
    </Avatar>
  ),
};
