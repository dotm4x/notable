import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../button/button.js';
import { Tooltip } from './tooltip.js';

const meta = {
  parameters: {
    layout: 'centered',
  },
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

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The default tooltip appearing on hover or focus.',
      },
    },
  },
};

export const Placement: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Tooltips can be positioned on top, right, bottom, or left of the trigger.',
      },
    },
  },
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
