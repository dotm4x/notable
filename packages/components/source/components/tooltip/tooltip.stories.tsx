import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../button/button.js';
import { Tooltip } from './tooltip.js';

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  args: {
    content: 'More information about this action',
    delay: 350,
    disabled: false,
    placement: 'top',
    children: <Button variant="outline">Hover or focus me</Button>,
  },
  argTypes: {
    placement: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
    },
    delay: {
      control: { type: 'number', min: 0, step: 50 },
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Placements: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '48px',
        padding: '64px',
      }}
    >
      {(['top', 'right', 'bottom', 'left'] as const).map((placement) => (
        <Tooltip
          key={placement}
          content={`Tooltip positioned ${placement}`}
          placement={placement}
        >
          <Button variant="outline">{placement}</Button>
        </Tooltip>
      ))}
    </div>
  ),
};
