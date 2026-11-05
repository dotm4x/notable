import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pager } from './pager.js';

const meta = {
  title: 'Components/Pager',
  component: Pager,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 640 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    previous: {
      href: '#installation',
      label: 'Installation',
    },
    next: {
      href: '#components',
      label: 'Components',
    },
  },
} satisfies Meta<typeof Pager>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const PreviousOnly: Story = {
  args: {
    next: undefined,
  },
};

export const NextOnly: Story = {
  args: {
    previous: undefined,
  },
};

export const CustomLabels: Story = {
  args: {
    previousLabel: 'Anterior',
    nextLabel: 'Siguiente',
  },
};
