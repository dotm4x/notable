import type { Meta, StoryObj } from '@storybook/react-vite';
import { Shortcut } from './shortcut.js';

const meta = {
  title: 'Components/Shortcut',
  component: Shortcut,
  tags: ['autodocs'],
  args: {
    children: 'K',
  },
} satisfies Meta<typeof Shortcut>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SingleCharacter: Story = {};

export const CommonKeys: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      {['Enter', 'Escape', 'Tab', 'Backspace'].map((key) => (
        <Shortcut key={key}>{key}</Shortcut>
      ))}
    </div>
  ),
};

export const ModifierKeys: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      {['Ctrl', 'Shift', 'Alt', '⌘'].map((key) => (
        <Shortcut key={key}>{key}</Shortcut>
      ))}
    </div>
  ),
};

export const ComposedShortcuts: Story = {
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
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      {['Backspace', 'Page Down', 'Caps Lock'].map((key) => (
        <Shortcut key={key}>{key}</Shortcut>
      ))}
    </div>
  ),
};

export const InlineUsage: Story = {
  render: () => (
    <p>
      Press <Shortcut>Enter</Shortcut> to submit, or use{' '}
      <Shortcut>Esc</Shortcut> to close the dialog.
    </p>
  ),
};

export const LightAndDarkThemes: Story = {
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
