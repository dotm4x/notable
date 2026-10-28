import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../button/button.js';
import { NavigationMenu } from './navigation-menu.js';

const meta = {
  title: 'Components/NavigationMenu',
  component: NavigationMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof NavigationMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    'aria-label': 'Main',
  },
  render: (args) => (
    <NavigationMenu {...args}>
      <NavigationMenu.List>
        <NavigationMenu.Item>
          <NavigationMenu.Link href="/" active>
            Home
          </NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link href="/notes">Notes</NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link href="/settings">Settings</NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu>
  ),
};

export const WithDropdowns: Story = {
  args: {
    'aria-label': 'Main',
  },
  render: (args) => (
    <NavigationMenu {...args}>
      <NavigationMenu.List>
        <NavigationMenu.Item value="products">
          <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <NavigationMenu.Link href="/editor" closeOnClick>
              Editor
            </NavigationMenu.Link>
            <NavigationMenu.Link href="/sync" closeOnClick>
              Sync
            </NavigationMenu.Link>
            <NavigationMenu.Link href="/export" closeOnClick>
              Export
            </NavigationMenu.Link>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        <NavigationMenu.Item value="resources">
          <NavigationMenu.Trigger>Resources</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <NavigationMenu.Link href="/docs" closeOnClick>
              Documentation
            </NavigationMenu.Link>
            <NavigationMenu.Link href="/changelog" closeOnClick>
              Changelog
            </NavigationMenu.Link>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        <NavigationMenu.Item value="pricing">
          <NavigationMenu.Link href="/pricing">Pricing</NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item value="coming-soon">
          <NavigationMenu.Trigger disabled>Coming soon</NavigationMenu.Trigger>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu>
  ),
};

export const RichContent: Story = {
  args: {
    'aria-label': 'Main',
  },
  render: (args) => (
    <NavigationMenu {...args}>
      <NavigationMenu.List>
        <NavigationMenu.Item value="workspaces">
          <NavigationMenu.Trigger>Workspaces</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <div
              style={{
                display: 'grid',
                gap: 'var(--notable-spacing-2)',
                gridTemplateColumns: 'repeat(2, minmax(12rem, 1fr))',
                padding: 'var(--notable-spacing-2)',
              }}
            >
              <NavigationMenu.Link href="/work/personal">
                Personal
              </NavigationMenu.Link>
              <NavigationMenu.Link href="/work/team">Team</NavigationMenu.Link>
              <NavigationMenu.Link href="/work/archive">
                Archive
              </NavigationMenu.Link>
              <NavigationMenu.Link href="/work/shared">
                Shared with me
              </NavigationMenu.Link>
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu>
  ),
};

function ControlledNavigation() {
  const [value, setValue] = useState<string | null>(null);

  return (
    <div style={{ display: 'grid', gap: 'var(--notable-spacing-4)' }}>
      <p>Open item: {value ?? 'none'}</p>
      <NavigationMenu aria-label="Main" value={value} onValueChange={setValue}>
        <NavigationMenu.List>
          <NavigationMenu.Item value="products">
            <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
            <NavigationMenu.Content>
              <NavigationMenu.Link href="/editor">Editor</NavigationMenu.Link>
              <NavigationMenu.Link href="/sync">Sync</NavigationMenu.Link>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
          <NavigationMenu.Item value="resources">
            <NavigationMenu.Trigger>Resources</NavigationMenu.Trigger>
            <NavigationMenu.Content>
              <NavigationMenu.Link href="/docs">
                Documentation
              </NavigationMenu.Link>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu>
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledNavigation />,
};

export const Narrow: Story = {
  args: {
    'aria-label': 'Main',
  },
  render: (args) => (
    <div style={{ width: '20rem' }}>
      <NavigationMenu {...args}>
        <NavigationMenu.List>
          <NavigationMenu.Item value="products">
            <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
            <NavigationMenu.Content>
              <NavigationMenu.Link href="/editor">Editor</NavigationMenu.Link>
              <NavigationMenu.Link href="/sync">Sync</NavigationMenu.Link>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
          <NavigationMenu.Item>
            <NavigationMenu.Link href="/pricing">Pricing</NavigationMenu.Link>
          </NavigationMenu.Item>
          <NavigationMenu.Item>
            <NavigationMenu.Link href="/contact">Contact</NavigationMenu.Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu>
    </div>
  ),
};

export const CustomDropdownContent: Story = {
  args: {
    'aria-label': 'Main',
  },
  render: (args) => (
    <NavigationMenu {...args}>
      <NavigationMenu.List>
        <NavigationMenu.Item value="product">
          <NavigationMenu.Trigger>Product</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <div
              style={{
                display: 'grid',
                gap: 'var(--notable-spacing-1)',
                padding: 'var(--notable-spacing-2)',
                width: '18rem',
              }}
            >
              <NavigationMenu.Link href="/editor" closeOnClick>
                <strong>Editor</strong>
                <span>Write and organize notes in real time.</span>
              </NavigationMenu.Link>
              <NavigationMenu.Link href="/sync" closeOnClick>
                <strong>Sync</strong>
                <span>Keep every device up to date.</span>
              </NavigationMenu.Link>
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu>
  ),
};

export const CustomPanelContent: Story = {
  args: {
    'aria-label': 'Main',
  },
  render: (args) => (
    <NavigationMenu {...args}>
      <NavigationMenu.List>
        <NavigationMenu.Item value="account">
          <NavigationMenu.Trigger>Account</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <div
              style={{
                display: 'grid',
                gap: 'var(--notable-spacing-3)',
                padding: 'var(--notable-spacing-3)',
                width: '20rem',
              }}
            >
              <div style={{ display: 'grid', gap: 'var(--notable-spacing-1)' }}>
                <strong>Signed in as Ada</strong>
                <span>ada@example.com</span>
              </div>
              <NavigationMenu.Link href="/profile" closeOnClick>
                Profile and preferences
              </NavigationMenu.Link>
              <NavigationMenu.Link href="/billing" closeOnClick>
                Billing
              </NavigationMenu.Link>
              <Button variant="secondary">Sign out</Button>
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu>
  ),
};

export const GroupedColumns: Story = {
  args: {
    'aria-label': 'Main',
  },
  render: (args) => (
    <NavigationMenu {...args}>
      <NavigationMenu.List>
        <NavigationMenu.Item value="resources">
          <NavigationMenu.Trigger>Resources</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <div
              style={{
                display: 'grid',
                gap: 'var(--notable-spacing-4)',
                gridAutoFlow: 'column',
                padding: 'var(--notable-spacing-2)',
              }}
            >
              <NavigationMenu.Group aria-label="Learn">
                <NavigationMenu.Link href="/docs">
                  Documentation
                </NavigationMenu.Link>
                <NavigationMenu.Link href="/tutorials">
                  Tutorials
                </NavigationMenu.Link>
              </NavigationMenu.Group>
              <NavigationMenu.Group aria-label="Community">
                <NavigationMenu.Link href="/forum">Forum</NavigationMenu.Link>
                <NavigationMenu.Link href="/changelog">
                  Changelog
                </NavigationMenu.Link>
              </NavigationMenu.Group>
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu>
  ),
};

export const DifferentPanelDimensions: Story = {
  args: {
    'aria-label': 'Main',
  },
  render: (args) => (
    <NavigationMenu {...args}>
      <NavigationMenu.List>
        <NavigationMenu.Item value="short">
          <NavigationMenu.Trigger>Short</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <NavigationMenu.Link href="/one">One link</NavigationMenu.Link>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        <NavigationMenu.Item value="tall">
          <NavigationMenu.Trigger>Tall</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <div
              style={{
                display: 'grid',
                gap: 'var(--notable-spacing-1)',
                padding: 'var(--notable-spacing-2)',
                width: '22rem',
              }}
            >
              {Array.from({ length: 8 }, (_, index) => (
                <NavigationMenu.Link key={index} href={`/item-${index + 1}`}>
                  Item {index + 1}
                </NavigationMenu.Link>
              ))}
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        <NavigationMenu.Item value="wide">
          <NavigationMenu.Trigger>Wide</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <div
              style={{
                display: 'grid',
                gap: 'var(--notable-spacing-2)',
                gridTemplateColumns: 'repeat(3, minmax(10rem, 1fr))',
                padding: 'var(--notable-spacing-2)',
              }}
            >
              <NavigationMenu.Link href="/wide-a">Alpha</NavigationMenu.Link>
              <NavigationMenu.Link href="/wide-b">Bravo</NavigationMenu.Link>
              <NavigationMenu.Link href="/wide-c">Charlie</NavigationMenu.Link>
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu>
  ),
};

export const KeyboardNavigation: Story = {
  args: {
    'aria-label': 'Main',
  },
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--notable-spacing-4)' }}>
      <p>
        Use Tab to reach a trigger, Enter or Space to open its panel, and the
        arrow keys to move between triggers and links.
      </p>
      <NavigationMenu {...args}>
        <NavigationMenu.List>
          <NavigationMenu.Item value="products">
            <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
            <NavigationMenu.Content>
              <NavigationMenu.Link href="/editor">Editor</NavigationMenu.Link>
              <NavigationMenu.Link href="/sync">Sync</NavigationMenu.Link>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
          <NavigationMenu.Item value="resources">
            <NavigationMenu.Trigger>Resources</NavigationMenu.Trigger>
            <NavigationMenu.Content>
              <NavigationMenu.Link href="/docs">
                Documentation
              </NavigationMenu.Link>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
          <NavigationMenu.Item value="pricing">
            <NavigationMenu.Link href="/pricing">Pricing</NavigationMenu.Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu>
    </div>
  ),
};
