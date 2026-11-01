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
import { expect, userEvent, within } from 'storybook/test';
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const sidebar = canvas.getByRole('navigation', { name: 'Sidebar' });
    const brand = canvasElement.querySelector<HTMLElement>(
      '.notable-sidebar__brand',
    );
    const brandIcon = brand?.querySelector<HTMLElement>(
      '.notable-sidebar__brand-icon',
    );
    const items = [
      canvas.getByRole('link', { name: 'Overview' }),
      canvas.getByRole('button', { name: 'Design system' }),
    ];

    if (!brand || !brandIcon) {
      throw new Error('Expected the collapsed sidebar brand to have an icon.');
    }

    const brandBounds = brand.getBoundingClientRect();
    const brandIconBounds = brandIcon.getBoundingClientRect();
    expect(
      Math.abs(
        brandBounds.left +
          brandBounds.width / 2 -
          (brandIconBounds.left + brandIconBounds.width / 2),
      ),
      'brand icon horizontal alignment',
    ).toBeLessThan(2);

    const itemIcons = items.map((item) => {
      const icon = item.querySelector<HTMLElement>(
        '.notable-sidebar__item-icon',
      );

      if (!icon) {
        throw new Error(
          'Expected each collapsed sidebar option to have an icon.',
        );
      }

      return { item, icon };
    });
    const activeWidthTransition = () =>
      sidebar
        .getAnimations()
        .find(
          (animation): animation is CSSTransition =>
            animation instanceof CSSTransition &&
            animation.transitionProperty === 'width' &&
            animation.playState === 'running',
        );

    for (const { item, icon } of itemIcons) {
      const { height, width, left, top } = item.getBoundingClientRect();
      const iconBounds = icon.getBoundingClientRect();

      expect(width).toBeGreaterThanOrEqual(38);
      expect(
        Math.abs(width - height),
        `option size: ${width}x${height}`,
      ).toBeLessThan(1);
      expect(
        Math.abs(left + width / 2 - (iconBounds.left + iconBounds.width / 2)),
        'icon horizontal alignment',
      ).toBeLessThan(2);
      expect(
        Math.abs(top + height / 2 - (iconBounds.top + iconBounds.height / 2)),
        'icon vertical alignment',
      ).toBeLessThan(1);
      expect(getComputedStyle(item).aspectRatio).not.toBe('auto');
    }

    await userEvent.click(
      within(sidebar).getByRole('button', { name: 'Expand sidebar' }),
    );
    await activeWidthTransition()?.finished;
    const brandOffsetBeforeClose =
      brandIcon.getBoundingClientRect().left +
      brandIcon.getBoundingClientRect().width / 2 -
      sidebar.getBoundingClientRect().left;
    const iconOffsetsBeforeClose = itemIcons.map(({ item, icon }) => {
      const itemLeft = item.getBoundingClientRect().left;
      const iconBounds = icon.getBoundingClientRect();
      return iconBounds.left + iconBounds.width / 2 - itemLeft;
    });
    await userEvent.click(
      within(sidebar).getByRole('button', { name: 'Collapse sidebar' }),
    );
    const brandOffsetAfterClose =
      brandIcon.getBoundingClientRect().left +
      brandIcon.getBoundingClientRect().width / 2 -
      sidebar.getBoundingClientRect().left;
    expect(
      Math.abs(brandOffsetAfterClose - brandOffsetBeforeClose),
      'brand icon should move smoothly when the sidebar closes',
    ).toBeLessThan(2);
    for (const [index, { item, icon }] of itemIcons.entries()) {
      const itemLeft = item.getBoundingClientRect().left;
      const iconBounds = icon.getBoundingClientRect();
      const currentOffset = iconBounds.left + iconBounds.width / 2 - itemLeft;
      expect(
        Math.abs(currentOffset - iconOffsetsBeforeClose[index]!),
      ).toBeLessThan(10);
    }

    const closeTransition = activeWidthTransition();
    if (closeTransition) {
      const maxItemHeight = () =>
        Math.max(...items.map((item) => item.getBoundingClientRect().height));
      const heights = [maxItemHeight()];

      while (closeTransition.playState === 'running') {
        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => resolve());
        });
        heights.push(maxItemHeight());
      }

      expect(Math.max(...heights)).toBeLessThanOrEqual(40);
    }

    expect(sidebar).toHaveAttribute('data-state', 'collapsed');
    expect(getComputedStyle(sidebar).transition).toContain('width');
  },
  parameters: {
    docs: {
      description: {
        story:
          'The sidebar can start in its compact icon-only state and expand from either trigger.',
      },
    },
  },
};
