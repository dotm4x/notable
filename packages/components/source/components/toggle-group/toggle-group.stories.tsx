import { Bold, Italic, Underline } from '../../icons';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ToggleGroup } from './toggle-group.js';

const meta = {
  title: 'Components/ToggleGroup',
  component: ToggleGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ToggleGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    type: 'single',
  },
  parameters: {
    docs: {
      description: {
        story:
          'A single-selection group coordinates mutually exclusive toggles.',
      },
    },
  },
  render: () => (
    <ToggleGroup type="single" aria-label="Text formatting" defaultValue="bold">
      <ToggleGroup.Item value="bold">
        <Bold aria-hidden="true" />
        Bold
      </ToggleGroup.Item>
      <ToggleGroup.Item value="italic">
        <Italic aria-hidden="true" />
        Italic
      </ToggleGroup.Item>
      <ToggleGroup.Item value="underline">
        <Underline aria-hidden="true" />
        Underline
      </ToggleGroup.Item>
    </ToggleGroup>
  ),
};

export const Multiple: Story = {
  args: {
    type: 'multiple',
  },
  parameters: {
    docs: {
      description: {
        story: 'Multiple selection lets each toggle be pressed independently.',
      },
    },
  },
  render: () => (
    <ToggleGroup
      type="multiple"
      aria-label="Text formatting"
      defaultValue={['bold']}
    >
      <ToggleGroup.Item value="bold">
        <Bold aria-hidden="true" />
        Bold
      </ToggleGroup.Item>
      <ToggleGroup.Item value="italic">
        <Italic aria-hidden="true" />
        Italic
      </ToggleGroup.Item>
      <ToggleGroup.Item value="underline">
        <Underline aria-hidden="true" />
        Underline
      </ToggleGroup.Item>
    </ToggleGroup>
  ),
};

export const VariantsAndSizes: Story = {
  args: {
    type: 'multiple',
  },
  parameters: {
    docs: {
      description: {
        story: 'Groups pass their variant and size to every item.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'grid', gap: '16px' }}>
      <ToggleGroup type="multiple" aria-label="Default style">
        <ToggleGroup.Item value="bold">Default</ToggleGroup.Item>
        <ToggleGroup.Item value="italic">Style</ToggleGroup.Item>
      </ToggleGroup>
      <ToggleGroup
        type="multiple"
        variant="outline"
        size="small"
        aria-label="Compact outline style"
      >
        <ToggleGroup.Item value="bold">Compact</ToggleGroup.Item>
        <ToggleGroup.Item value="italic">Outline</ToggleGroup.Item>
      </ToggleGroup>
    </div>
  ),
};

export const Vertical: Story = {
  args: {
    type: 'multiple',
    orientation: 'vertical',
  },
  parameters: {
    docs: {
      description: {
        story: 'Vertical groups arrange items and navigate along a column.',
      },
    },
  },
  render: () => (
    <ToggleGroup
      type="multiple"
      orientation="vertical"
      aria-label="Text formatting"
    >
      <ToggleGroup.Item value="bold">
        <Bold aria-hidden="true" />
        Bold
      </ToggleGroup.Item>
      <ToggleGroup.Item value="italic">
        <Italic aria-hidden="true" />
        Italic
      </ToggleGroup.Item>
      <ToggleGroup.Item value="underline">
        <Underline aria-hidden="true" />
        Underline
      </ToggleGroup.Item>
    </ToggleGroup>
  ),
};

export const Disabled: Story = {
  args: {
    type: 'multiple',
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'A disabled group preserves pressed states without interaction.',
      },
    },
  },
  render: () => (
    <ToggleGroup
      type="multiple"
      aria-label="Managed formatting"
      disabled
      defaultValue={['bold']}
    >
      <ToggleGroup.Item value="bold">Bold</ToggleGroup.Item>
      <ToggleGroup.Item value="italic">Italic</ToggleGroup.Item>
    </ToggleGroup>
  ),
};
