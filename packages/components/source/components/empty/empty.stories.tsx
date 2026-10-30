import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  FolderOpen,
  Inbox,
  Plus,
  SearchX,
  Upload,
  UserPlus,
} from 'lucide-react';
import { Avatar } from '../avatar/avatar.js';
import { AvatarGroup } from '../avatar/avatar-group.js';
import { Button } from '../button/button.js';
import { Card } from '../card/card.js';
import { Input } from '../input/input.js';
import { Empty } from './empty.js';

const meta = {
  parameters: {
    layout: 'centered',
  },
  title: 'Components/Empty',
  component: Empty,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['default', 'outline', 'surface'],
    },
    size: {
      control: 'inline-radio',
      options: ['compact', 'default', 'spacious'],
    },
  },
  args: {
    variant: 'default',
    size: 'default',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 480, maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <Empty {...args}>
      <Empty.Header>
        <Empty.Media variant="icon">
          <FolderOpen />
        </Empty.Media>
        <Empty.Title>No projects yet</Empty.Title>
        <Empty.Description>
          Create something to see it appear here.
        </Empty.Description>
      </Empty.Header>
    </Empty>
  ),
} satisfies Meta<typeof Empty>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The default empty state with a centered header and icon.',
      },
    },
  },
};

export const Action: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Empty states can include a primary call-to-action button.',
      },
    },
  },
  render: (args) => (
    <Empty {...args}>
      <Empty.Header>
        <Empty.Media variant="icon">
          <FolderOpen />
        </Empty.Media>
        <Empty.Title>No projects yet</Empty.Title>
        <Empty.Description>
          Create your first project to get started.
        </Empty.Description>
      </Empty.Header>
      <Empty.Content>
        <Button variant="primary">
          <Plus aria-hidden="true" />
          Create project
        </Button>
      </Empty.Content>
    </Empty>
  ),
};

export const Actions: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Empty states support multiple secondary actions.',
      },
    },
  },
  render: (args) => (
    <Empty {...args}>
      <Empty.Header>
        <Empty.Media variant="icon">
          <Inbox />
        </Empty.Media>
        <Empty.Title>Your inbox is empty</Empty.Title>
        <Empty.Description>
          New messages will appear here. You can also import an existing
          archive.
        </Empty.Description>
      </Empty.Header>
      <Empty.Content>
        <Button variant="primary">Compose message</Button>
        <Button variant="outline">
          <Upload aria-hidden="true" />
          Import archive
        </Button>
      </Empty.Content>
    </Empty>
  ),
};

export const Search: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Empty states can integrate search inputs or filter clearing controls.',
      },
    },
  },
  render: (args) => (
    <Empty {...args}>
      <Empty.Header>
        <Empty.Media variant="icon">
          <SearchX />
        </Empty.Media>
        <Empty.Title>No results found</Empty.Title>
        <Empty.Description>
          Try a different search term or clear the filters.
        </Empty.Description>
      </Empty.Header>
      <Empty.Content>
        <Input
          type="search"
          aria-label="Search projects"
          placeholder="Search projects"
        />
        <Button variant="outline">Clear search</Button>
      </Empty.Content>
    </Empty>
  ),
};

export const Illustration: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Empty states support custom SVG illustrations or graphics in the media slot.',
      },
    },
  },
  render: (args) => (
    <Empty {...args}>
      <Empty.Header>
        <Empty.Media>
          <svg
            width="120"
            height="88"
            viewBox="0 0 120 88"
            role="img"
            aria-label="Illustration of an open notebook"
          >
            <rect
              x="18"
              y="12"
              width="84"
              height="64"
              rx="10"
              fill="currentColor"
              opacity="0.12"
            />
            <rect
              x="34"
              y="28"
              width="52"
              height="6"
              rx="3"
              fill="currentColor"
              opacity="0.5"
            />
            <rect
              x="34"
              y="42"
              width="36"
              height="6"
              rx="3"
              fill="currentColor"
              opacity="0.3"
            />
          </svg>
        </Empty.Media>
        <Empty.Title>Nothing written yet</Empty.Title>
        <Empty.Description>
          Notes you create will be listed here.
        </Empty.Description>
      </Empty.Header>
    </Empty>
  ),
};

export const Team: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Empty states can display avatar groups to highlight collaboration.',
      },
    },
  },
  render: (args) => (
    <Empty {...args}>
      <Empty.Header>
        <Empty.Media>
          <AvatarGroup max={3}>
            <Avatar>
              <Avatar.Fallback>MP</Avatar.Fallback>
            </Avatar>
            <Avatar>
              <Avatar.Fallback>RS</Avatar.Fallback>
            </Avatar>
            <Avatar>
              <Avatar.Fallback>JD</Avatar.Fallback>
            </Avatar>
            <Avatar>
              <Avatar.Fallback>AK</Avatar.Fallback>
            </Avatar>
          </AvatarGroup>
        </Empty.Media>
        <Empty.Title>No team members yet</Empty.Title>
        <Empty.Description>
          Invite collaborators to share projects and work together.
        </Empty.Description>
      </Empty.Header>
      <Empty.Content>
        <Button variant="primary">
          <UserPlus aria-hidden="true" />
          Invite members
        </Button>
      </Empty.Content>
    </Empty>
  ),
};

export const Outline: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Empty states support an outline border variant.',
      },
    },
  },
  args: {
    variant: 'outline',
  },
  render: (args) => (
    <Empty {...args}>
      <Empty.Header>
        <Empty.Media variant="icon">
          <FolderOpen />
        </Empty.Media>
        <Empty.Title>No files in this folder</Empty.Title>
        <Empty.Description>Drop files here to upload them.</Empty.Description>
      </Empty.Header>
      <Empty.Content>
        <Button variant="outline">Upload files</Button>
      </Empty.Content>
    </Empty>
  ),
};

export const Surface: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Empty states support a subtle filled surface variant.',
      },
    },
  },
  args: {
    variant: 'surface',
  },
  render: (args) => (
    <Empty {...args}>
      <Empty.Header>
        <Empty.Media variant="icon">
          <Inbox />
        </Empty.Media>
        <Empty.Title>No notifications</Empty.Title>
        <Empty.Description>You are all caught up.</Empty.Description>
      </Empty.Header>
    </Empty>
  ),
};

export const Compact: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Empty states support a compact sizing variant for restricted spaces.',
      },
    },
  },
  args: {
    size: 'compact',
    variant: 'outline',
  },
  render: (args) => (
    <Empty {...args}>
      <Empty.Header>
        <Empty.Media variant="icon">
          <Inbox />
        </Empty.Media>
        <Empty.Title>No items</Empty.Title>
        <Empty.Description>Add an item to see it here.</Empty.Description>
      </Empty.Header>
      <Empty.Content>
        <Button variant="outline" size="small">
          Add item
        </Button>
      </Empty.Content>
    </Empty>
  ),
};

export const Spacious: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Empty states support a spacious padding variant for large feature sections.',
      },
    },
  },
  args: {
    size: 'spacious',
  },
  render: (args) => (
    <Empty {...args}>
      <Empty.Header>
        <Empty.Media variant="icon">
          <FolderOpen />
        </Empty.Media>
        <Empty.Title>Welcome to your workspace</Empty.Title>
        <Empty.Description>
          Projects, documents, and shared folders will appear here once you
          create them. Start with a project to organize your work.
        </Empty.Description>
      </Empty.Header>
      <Empty.Content>
        <Button variant="primary">Create project</Button>
        <Button variant="ghost">Learn more</Button>
      </Empty.Content>
    </Empty>
  ),
};

export const InsideCard: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: 560, maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
  render: () => (
    <Card>
      <Card.Header>
        <Card.Title>Shared folders</Card.Title>
        <Card.Description>
          Folders shared with you by teammates.
        </Card.Description>
      </Card.Header>
      <Card.Content>
        <Empty size="compact">
          <Empty.Header>
            <Empty.Media variant="icon">
              <FolderOpen />
            </Empty.Media>
            <Empty.Title as="h4">Nothing shared yet</Empty.Title>
            <Empty.Description>
              When someone shares a folder with you, it will show up here.
            </Empty.Description>
          </Empty.Header>
        </Empty>
      </Card.Content>
    </Card>
  ),
};
