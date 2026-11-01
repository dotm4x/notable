import {
  Activity,
  Bell,
  Box,
  CircleHelp,
  Folder,
  Home,
  Settings,
  SquarePen,
  UserRound,
} from 'lucide-react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from '../avatar/avatar.js';
import { Sidebar } from './sidebar.js';

const meta = {
  title: 'Components/Sidebar',
  component: Sidebar.Root,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Sidebar.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

function SidebarExample({ defaultOpen = true }: { defaultOpen?: boolean }) {
  return (
    <Sidebar.Root defaultOpen={defaultOpen}>
      <Sidebar.Header>
        <Sidebar.Brand icon={<Box aria-hidden="true" />}>Notable</Sidebar.Brand>
      </Sidebar.Header>
      <Sidebar.Content>
        <Sidebar.Group>
          <Sidebar.GroupLabel>Workspace</Sidebar.GroupLabel>
          <Sidebar.GroupContent>
            <Sidebar.Menu>
              <Sidebar.MenuItem>
                <Sidebar.Item
                  href="#overview"
                  icon={<Home aria-hidden="true" />}
                  active
                >
                  Overview
                </Sidebar.Item>
              </Sidebar.MenuItem>
              <Sidebar.MenuItem>
                <Sidebar.Item
                  href="#activity"
                  icon={<Activity aria-hidden="true" />}
                >
                  Activity
                </Sidebar.Item>
                <Sidebar.MenuBadge>
                  <span aria-hidden="true">3</span>
                  <span className="notable-sidebar__sr-only">
                    3 unread updates
                  </span>
                </Sidebar.MenuBadge>
              </Sidebar.MenuItem>
              <Sidebar.MenuItem>
                <Sidebar.Item
                  href="#notifications"
                  icon={<Bell aria-hidden="true" />}
                >
                  Notifications
                </Sidebar.Item>
              </Sidebar.MenuItem>
            </Sidebar.Menu>
          </Sidebar.GroupContent>
        </Sidebar.Group>
        <Sidebar.Group>
          <Sidebar.GroupLabel>Projects</Sidebar.GroupLabel>
          <Sidebar.GroupAction aria-label="Create project">
            <SquarePen aria-hidden="true" />
          </Sidebar.GroupAction>
          <Sidebar.GroupContent>
            <Sidebar.Menu>
              <Sidebar.MenuItem>
                <Sidebar.Submenu
                  label="Design system"
                  icon={<Folder aria-hidden="true" />}
                >
                  <Sidebar.SubmenuItem href="#foundations">
                    Foundations
                  </Sidebar.SubmenuItem>
                  <Sidebar.SubmenuItem href="#components">
                    Components
                  </Sidebar.SubmenuItem>
                </Sidebar.Submenu>
              </Sidebar.MenuItem>
            </Sidebar.Menu>
          </Sidebar.GroupContent>
        </Sidebar.Group>
      </Sidebar.Content>
      <Sidebar.Footer>
        <Sidebar.Menu>
          <Sidebar.MenuItem>
            <Sidebar.Item href="#help" icon={<CircleHelp aria-hidden="true" />}>
              Help and support
            </Sidebar.Item>
          </Sidebar.MenuItem>
          <Sidebar.MenuItem>
            <Sidebar.Item
              href="#settings"
              icon={<Settings aria-hidden="true" />}
            >
              Settings
            </Sidebar.Item>
          </Sidebar.MenuItem>
        </Sidebar.Menu>
        <Sidebar.Menu>
          <Sidebar.MenuItem>
            <Sidebar.Item
              href="#profile"
              icon={
                <Avatar size="small">
                  <Avatar.Fallback aria-hidden="true">
                    <UserRound />
                  </Avatar.Fallback>
                </Avatar>
              }
            >
              Jordan Davis
            </Sidebar.Item>
          </Sidebar.MenuItem>
        </Sidebar.Menu>
        <Sidebar.Trigger />
      </Sidebar.Footer>
      <Sidebar.Inset>
        <main style={{ padding: '2rem' }}>
          <Sidebar.Trigger />
          <h1>Overview</h1>
          <p>Your workspace, at a glance.</p>
        </main>
      </Sidebar.Inset>
    </Sidebar.Root>
  );
}

export const Default: Story = {
  render: () => <SidebarExample />,
  parameters: {
    docs: {
      description: {
        story:
          'A composed sidebar with grouped navigation, a nested project list, and a user footer.',
      },
    },
  },
};

export const Collapsed: Story = {
  render: () => <SidebarExample defaultOpen={false} />,
  parameters: {
    docs: {
      description: {
        story:
          'The sidebar can start in its compact icon-only state and expand from either trigger.',
      },
    },
  },
};
