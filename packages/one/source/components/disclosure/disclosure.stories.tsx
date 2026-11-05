import type { Meta, StoryObj } from '@storybook/react-vite';
import { CodeBlock } from '../code-block/code-block.js';
import { Disclosure } from './disclosure.js';

const meta = {
  title: 'Components/Disclosure',
  component: Disclosure,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 520 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    title: 'Shipping details',
    children: <p>Ships within two business days.</p>,
  },
} satisfies Meta<typeof Disclosure>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const OpenByDefault: Story = {
  args: {
    defaultOpen: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const WithCode: Story = {
  args: {
    title: 'SVG markup',
    children: (
      <CodeBlock>
        <CodeBlock.Content>{`<svg viewBox="0 0 24 24">…</svg>`}</CodeBlock.Content>
      </CodeBlock>
    ),
  },
};
