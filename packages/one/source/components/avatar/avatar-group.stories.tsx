import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from './avatar.js';
import { AvatarGroup } from './avatar-group.js';
import { Tooltip } from '../tooltip/tooltip.js';

const avatarSizes = ['small', 'medium', 'large', 'extra-large'] as const;

const meta = {
  parameters: {
    layout: 'centered',
  },
  title: 'Components/AvatarGroup',
  component: AvatarGroup,
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
} satisfies Meta<typeof AvatarGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The default avatar group stacking avatars together.',
      },
    },
  },
  render: (args) => (
    <AvatarGroup {...args}>
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

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Avatar groups support small, medium, large, and extra-large sizes.',
      },
    },
  },
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

export const Spacing: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Avatar groups support custom overlap spacing between avatars.',
      },
    },
  },
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

export const Vertical: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Avatar groups support vertical orientation.',
      },
    },
  },
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

export const Overflow: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Avatar groups support custom overflow indicator content.',
      },
    },
  },
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

export const Interactive: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Avatars within a group can wrap interactive links and tooltips.',
      },
    },
  },
  render: () => (
    <AvatarGroup size="large">
      <Tooltip content="Open Max's profile" placement="bottom">
        <a href="#max-profile" aria-label="MX Max Perez profile">
          <Avatar>
            <Avatar.Fallback>MX</Avatar.Fallback>
          </Avatar>
        </a>
      </Tooltip>
      <Tooltip content="Open Alex's profile" placement="bottom">
        <a href="#alex-profile" aria-label="AL Alex Lee profile">
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

export const Limited: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Avatar groups can limit the maximum number of visible avatars with `max`.',
      },
    },
  },
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

export const Large: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Large avatar groups containing many collaborators.',
      },
    },
  },
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
