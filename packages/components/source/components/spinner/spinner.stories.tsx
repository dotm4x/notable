import type { Meta, StoryObj } from '@storybook/react-vite';
import { Spinner } from './spinner.js';

const meta = {
  title: 'Components/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  args: {
    size: 'md',
    label: 'Loading',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
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
        gap: '24px',
      }}
    >
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
      }}
    >
      <span style={{ color: '#83b5e0' }}>
        <Spinner />
      </span>

      <span style={{ color: '#e98b91' }}>
        <Spinner />
      </span>

      <span style={{ color: '#a9cba8' }}>
        <Spinner />
      </span>

      <span style={{ color: '#38332f' }}>
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
        gap: '8px',
        color: '#38332f',
        fontFamily: 'var(--bodypop-font-family)',
      }}
    >
      <Spinner size="sm" />
      <span>Loading your projects...</span>
    </div>
  ),
};

export const Large: Story = {
  args: {
    size: 'lg',
    label: 'Loading content',
  },
};
