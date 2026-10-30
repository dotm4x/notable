import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../button/button.js';
import { Tabs } from './tabs.js';

const meta = {
  parameters: {
    layout: 'centered',
  },
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  args: {
    defaultValue: 'preview',
  },
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The default tabs component with animated active indicator.',
      },
    },
  },
  render: () => (
    <Tabs defaultValue="preview">
      <Tabs.List aria-label="Example">
        <Tabs.Trigger value="preview">Preview</Tabs.Trigger>
        <Tabs.Trigger value="code">Code</Tabs.Trigger>
        <Tabs.Trigger value="api">API</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="preview">
        <Button>Example button</Button>
      </Tabs.Content>
      <Tabs.Content value="code">
        <pre>{'<Button>Example button</Button>'}</pre>
      </Tabs.Content>
      <Tabs.Content value="api">API reference.</Tabs.Content>
    </Tabs>
  ),
};

export const Documentation: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Tabs used for code and preview documentation examples.',
      },
    },
  },
  render: () => (
    <Tabs defaultValue="preview">
      <Tabs.List aria-label="Component example">
        <Tabs.Trigger value="preview">Preview</Tabs.Trigger>
        <Tabs.Trigger value="code">Code</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="preview">
        <Button variant="secondary">A documented component</Button>
      </Tabs.Content>
      <Tabs.Content value="code">
        <pre>
          {'<Button variant="secondary">A documented component</Button>'}
        </pre>
      </Tabs.Content>
    </Tabs>
  ),
};

export const Direction: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Active indicator transition direction following tab navigation order.',
      },
    },
  },
  render: () => (
    <Tabs defaultValue="overview">
      <Tabs.List aria-label="Directional panel example">
        <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
        <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
        <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="overview">
        Select tabs in either direction to see the panel transition follow the
        navigation.
      </Tabs.Content>
      <Tabs.Content value="activity">Recent project activity.</Tabs.Content>
      <Tabs.Content value="settings">Project settings.</Tabs.Content>
    </Tabs>
  ),
};

export const Lengths: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Tabs with varying label lengths; the active indicator smoothly resizes to fit each tab.',
      },
    },
  },
  render: () => (
    <Tabs defaultValue="overview">
      <Tabs.List aria-label="Project sections">
        <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
        <Tabs.Trigger value="activity">Recent activity</Tabs.Trigger>
        <Tabs.Trigger value="settings">Project settings</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="overview">A concise overview.</Tabs.Content>
      <Tabs.Content value="activity">The latest project activity.</Tabs.Content>
      <Tabs.Content value="settings">Settings for this project.</Tabs.Content>
    </Tabs>
  ),
};

export const Controlled: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Tabs support controlled active value state management.',
      },
    },
  },
  render: () => <ControlledTabsExample />,
};

function ControlledTabsExample() {
  const [value, setValue] = useState<string | null>('preview');

  return (
    <div style={{ display: 'grid', gap: '12px' }}>
      <Tabs value={value} onValueChange={setValue}>
        <Tabs.List aria-label="Controlled example">
          <Tabs.Trigger value="preview">Preview</Tabs.Trigger>
          <Tabs.Trigger value="code">Code</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="preview">
          The selected value is preview.
        </Tabs.Content>
        <Tabs.Content value="code">The selected value is code.</Tabs.Content>
      </Tabs>
      <span>Selected value: {value ?? 'none'}</span>
    </div>
  );
}

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Individual tab triggers can be disabled.',
      },
    },
  },
  render: () => (
    <Tabs defaultValue="overview">
      <Tabs.List aria-label="Sections">
        <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
        <Tabs.Trigger value="billing" disabled>
          Billing
        </Tabs.Trigger>
        <Tabs.Trigger value="members">Members</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="overview">Workspace overview.</Tabs.Content>
      <Tabs.Content value="billing">Billing details.</Tabs.Content>
      <Tabs.Content value="members">Workspace members.</Tabs.Content>
    </Tabs>
  ),
};

export const Scrollable: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Tabs with longer panel content where inactive panels preserve local state.',
      },
    },
  },
  render: () => (
    <Tabs defaultValue="details">
      <Tabs.List aria-label="Article">
        <Tabs.Trigger value="details">Details</Tabs.Trigger>
        <Tabs.Trigger value="history">History</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="details">
        <article style={{ maxWidth: '42rem' }}>
          <h3>Project details</h3>
          <p>
            This panel can contain longer content without affecting the tab
            list. inactive panels remain mounted but hidden, preserving their
            local state across tab changes.
          </p>
          <p>
            The active indicator follows the selected tab and resizes to match
            labels of different lengths.
          </p>
        </article>
      </Tabs.Content>
      <Tabs.Content value="history">Recent project changes.</Tabs.Content>
    </Tabs>
  ),
};

export const Themes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Tabs adapt correctly across light and dark themes.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'grid', gap: '16px' }}>
      {(['light', 'dark'] as const).map((theme) => (
        <div
          key={theme}
          data-theme={theme}
          style={{
            padding: '16px',
            borderRadius: 'var(--notable-radius-md)',
            background: 'var(--notable-color-background)',
            color: 'var(--notable-color-text)',
          }}
        >
          <Tabs defaultValue="first">
            <Tabs.List aria-label={`${theme} theme example`}>
              <Tabs.Trigger value="first">First</Tabs.Trigger>
              <Tabs.Trigger value="second">Second tab</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="first">{theme} theme.</Tabs.Content>
            <Tabs.Content value="second">
              Active indicator example.
            </Tabs.Content>
          </Tabs>
        </div>
      ))}
    </div>
  ),
};

export const Vertical: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Tabs support vertical orientation layouts.',
      },
    },
  },
  render: () => (
    <Tabs defaultValue="account" orientation="vertical">
      <Tabs.List aria-label="Settings sections">
        <Tabs.Trigger value="account">Account</Tabs.Trigger>
        <Tabs.Trigger value="security">Security</Tabs.Trigger>
        <Tabs.Trigger value="notifications">Notifications</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="account">Manage your account profile.</Tabs.Content>
      <Tabs.Content value="security">Manage security settings.</Tabs.Content>
      <Tabs.Content value="notifications">
        Choose notification preferences.
      </Tabs.Content>
    </Tabs>
  ),
};

export const Keyboard: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Full keyboard navigation support using arrow keys, Home, and End.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'grid', gap: '8px' }}>
      <Tabs defaultValue="one">
        <Tabs.List aria-label="Keyboard navigation example">
          <Tabs.Trigger value="one">One</Tabs.Trigger>
          <Tabs.Trigger value="two">Two</Tabs.Trigger>
          <Tabs.Trigger value="three">Three</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="one">
          Use the arrow keys to move and activate a tab. Home and End move to
          the first and last enabled tabs.
        </Tabs.Content>
        <Tabs.Content value="two">Second panel.</Tabs.Content>
        <Tabs.Content value="three">Third panel.</Tabs.Content>
      </Tabs>
      <small>
        The indicator transition is disabled when the operating system requests
        reduced motion.
      </small>
    </div>
  ),
};
