import type { Meta, StoryObj } from '@storybook/react-vite';
import { Spinner } from './spinner.js';

const meta = {
  title: 'Components/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  args: {
    size: 'medium',
    label: 'Loading',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    label: {
      control: 'text',
    },
  },
} satisfies Meta<typeof Spinner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--notable-spacing-6)',
      }}
    >
      <Spinner size="small" />
      <Spinner size="medium" />
      <Spinner size="large" />
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--notable-spacing-6)',
      }}
    >
      <span style={{ color: 'var(--notable-color-info)' }}>
        <Spinner />
      </span>

      <span style={{ color: 'var(--notable-color-danger)' }}>
        <Spinner />
      </span>

      <span style={{ color: 'var(--notable-color-success)' }}>
        <Spinner />
      </span>

      <span style={{ color: 'var(--notable-color-text)' }}>
        <Spinner />
      </span>
    </div>
  ),
};

export const WithText: Story = {
  render: () => (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--notable-spacing-2)',
        color: 'var(--notable-color-text)',
        fontFamily: 'var(--notable-font-family)',
      }}
    >
      <Spinner size="small" />
      <span>Loading your projects...</span>
    </div>
  ),
};

export const Large: Story = {
  args: {
    size: 'large',
    label: 'Loading content',
  },
};
