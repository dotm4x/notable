import { CircleHelp, UserRound } from 'lucide-react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from './avatar.js';
import { AvatarGroup } from './avatar-group.js';
import { Tooltip } from '../tooltip/tooltip.js';

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

export const Group: Story = {
  render: () => (
    <AvatarGroup>
      <Avatar>
        <Avatar.Image src="https://i.pravatar.cc/120?img=12" alt="Max Perez" />
        <Avatar.Fallback>MX</Avatar.Fallback>
      </Avatar>
      <Avatar>
        <Avatar.Image src="https://i.pravatar.cc/120?img=32" alt="Alex Lee" />
        <Avatar.Fallback>AL</Avatar.Fallback>
      </Avatar>
      <Avatar>
        <Avatar.Image src="https://i.pravatar.cc/120?img=47" alt="Sam Rivera" />
        <Avatar.Fallback>SR</Avatar.Fallback>
      </Avatar>
      <Avatar>
        <Avatar.Fallback>TC</Avatar.Fallback>
      </Avatar>
    </AvatarGroup>
  ),
};

export const GroupSizes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '16px' }}>
      {avatarSizes.map((size) => (
        <AvatarGroup key={size} size={size}>
          <Avatar>
            <Avatar.Fallback>MX</Avatar.Fallback>
          </Avatar>
          <Avatar>
            <Avatar.Fallback>AL</Avatar.Fallback>
          </Avatar>
          <Avatar>
            <Avatar.Fallback>SR</Avatar.Fallback>
          </Avatar>
        </AvatarGroup>
      ))}
    </div>
  ),
};

export const CustomOverlap: Story = {
  render: () => (
    <AvatarGroup spacing={16}>
      <Avatar>
        <Avatar.Fallback>MX</Avatar.Fallback>
      </Avatar>
      <Avatar>
        <Avatar.Fallback>AL</Avatar.Fallback>
      </Avatar>
      <Avatar>
        <Avatar.Fallback>SR</Avatar.Fallback>
      </Avatar>
    </AvatarGroup>
  ),
};

export const VerticalGroup: Story = {
  render: () => (
    <AvatarGroup orientation="vertical" spacing={12}>
      {['MX', 'AL', 'SR'].map((initials) => (
        <Avatar key={initials}>
          <Avatar.Fallback>{initials}</Avatar.Fallback>
        </Avatar>
      ))}
    </AvatarGroup>
  ),
};

export const CustomOverflow: Story = {
  render: () => (
    <AvatarGroup max={2} overflow={<span>more</span>}>
      {['MX', 'AL', 'SR', 'TC'].map((initials) => (
        <Avatar key={initials}>
          <Avatar.Fallback>{initials}</Avatar.Fallback>
        </Avatar>
      ))}
    </AvatarGroup>
  ),
};

export const InteractiveGroup: Story = {
  render: () => (
    <AvatarGroup size="large">
      <Tooltip content="Open Max's profile" placement="bottom">
        <a href="#max-profile" aria-label="Max Perez profile">
          <Avatar>
            <Avatar.Fallback>MX</Avatar.Fallback>
          </Avatar>
        </a>
      </Tooltip>
      <Tooltip content="Open Alex's profile" placement="bottom">
        <a href="#alex-profile" aria-label="Alex Lee profile">
          <Avatar>
            <Avatar.Fallback>AL</Avatar.Fallback>
          </Avatar>
        </a>
      </Tooltip>
      <Avatar>
        <Avatar.Fallback>SR</Avatar.Fallback>
      </Avatar>
    </AvatarGroup>
  ),
};

export const LimitedGroup: Story = {
  render: () => (
    <AvatarGroup max={3}>
      <Avatar>
        <Avatar.Fallback>MX</Avatar.Fallback>
      </Avatar>
      <Avatar>
        <Avatar.Fallback>AL</Avatar.Fallback>
      </Avatar>
      <Avatar>
        <Avatar.Fallback>SR</Avatar.Fallback>
      </Avatar>
      <Avatar>
        <Avatar.Fallback>TC</Avatar.Fallback>
      </Avatar>
      <Avatar>
        <Avatar.Fallback>JW</Avatar.Fallback>
      </Avatar>
      <Avatar>
        <Avatar.Fallback>+?</Avatar.Fallback>
      </Avatar>
    </AvatarGroup>
  ),
};

export const LargeGroup: Story = {
  render: () => (
    <AvatarGroup max={6} size="large">
      {['MX', 'AL', 'SR', 'TC', 'JW', 'KP', 'ND', 'EO', 'BM'].map(
        (initials) => (
          <Avatar key={initials}>
            <Avatar.Fallback>{initials}</Avatar.Fallback>
          </Avatar>
        ),
      )}
    </AvatarGroup>
  ),
};
