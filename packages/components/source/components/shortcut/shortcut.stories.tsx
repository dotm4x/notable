import type { Meta, StoryObj } from '@storybook/react-vite';
import { Shortcut } from './shortcut.js';

const meta = {
  parameters: {
    layout: 'centered',
  },
  title: 'Components/Shortcut',
  component: Shortcut,
  tags: ['autodocs'],
  args: {
    children: 'K',
  },
} satisfies Meta<typeof Shortcut>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The default keyboard shortcut key badge.',
      },
    },
  },
};

export const Keys: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Keyboard shortcuts representing common navigation keys.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      {['Enter', 'Escape', 'Tab', 'Backspace'].map((key) => (
        <Shortcut key={key}>{key}</Shortcut>
      ))}
    </div>
  ),
};

export const Modifiers: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Keyboard shortcuts representing modifier keys.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      {['Ctrl', 'Shift', 'Alt', '⌘'].map((key) => (
        <Shortcut key={key}>{key}</Shortcut>
      ))}
    </div>
  ),
};

export const Combination: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Combining multiple keys to display shortcut combinations.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'grid', gap: '12px' }}>
      <div
        aria-label="Control plus Shift plus P"
        role="group"
        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <Shortcut>Ctrl</Shortcut>
        <span aria-hidden="true">+</span>
        <Shortcut>Shift</Shortcut>
        <span aria-hidden="true">+</span>
        <Shortcut>P</Shortcut>
      </div>
      <div
        aria-label="Command plus K"
        role="group"
        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <Shortcut>⌘</Shortcut>
        <span aria-hidden="true">+</span>
        <Shortcut>K</Shortcut>
      </div>
      <small>
        Shortcuts are examples; use combinations appropriate to your
        application.
      </small>
    </div>
  ),
};

export const LongLabels: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Shortcuts with longer descriptive key names.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      {['Backspace', 'Page Down', 'Caps Lock'].map((key) => (
        <Shortcut key={key}>{key}</Shortcut>
      ))}
    </div>
  ),
};

export const Inline: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Shortcuts embedded inline within body text instructions.',
      },
    },
  },
  render: () => (
    <p>
      Press <Shortcut>Enter</Shortcut> to submit, or use{' '}
      <Shortcut>Esc</Shortcut> to close the dialog.
    </p>
  ),
};

export const Themes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Shortcuts adapting correctly across light and dark themes.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'grid', gap: '12px' }}>
      {(['light', 'dark'] as const).map((theme) => (
        <div
          key={theme}
          data-theme={theme}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '16px',
            borderRadius: 'var(--notable-radius-md)',
            background: 'var(--notable-color-background)',
            color: 'var(--notable-color-text)',
          }}
        >
          <span>{theme} theme:</span>
          <Shortcut>Ctrl</Shortcut>
          <span aria-hidden="true">+</span>
          <Shortcut>P</Shortcut>
        </div>
      ))}
    </div>
  ),
};
