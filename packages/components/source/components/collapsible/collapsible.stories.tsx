import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChevronDown, Minus, Plus } from 'lucide-react';
import { Collapsible } from './collapsible.js';

const meta = {
  title: 'Components/Collapsible',
  component: Collapsible,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Collapsible>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The default collapsible disclosure view.',
      },
    },
  },
  render: () => (
    <Collapsible>
      <Collapsible.Trigger>Show details</Collapsible.Trigger>
      <Collapsible.Content>
        <p>Additional details are shown here when the disclosure is open.</p>
      </Collapsible.Content>
    </Collapsible>
  ),
};

export const Expanded: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Collapsibles can be rendered pre-expanded using `defaultOpen`.',
      },
    },
  },
  render: () => (
    <Collapsible defaultOpen>
      <Collapsible.Trigger>Hide details</Collapsible.Trigger>
      <Collapsible.Content>
        <p>This disclosure starts expanded.</p>
      </Collapsible.Content>
    </Collapsible>
  ),
};

export const Text: Story = {
  parameters: {
    docs: {
      description: {
        story: 'A text disclosure pattern for inline details.',
      },
    },
  },
  render: () => (
    <Collapsible>
      <Collapsible.Trigger>Shipping details</Collapsible.Trigger>
      <Collapsible.Content>
        <p>Ships within two business days from our warehouse.</p>
      </Collapsible.Content>
    </Collapsible>
  ),
};

export const CustomTrigger: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Collapsible triggers can include custom icons and elements.',
      },
    },
  },
  render: () => (
    <Collapsible>
      <Collapsible.Trigger>
        <span>Advanced options</span>
        <ChevronDown aria-hidden="true" />
      </Collapsible.Trigger>
      <Collapsible.Content>
        <p>Advanced options are available to fine-tune the behavior.</p>
      </Collapsible.Content>
    </Collapsible>
  ),
};

export const Controlled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Collapsibles support controlled open state and dynamic icon toggling.',
      },
    },
  },
  render: function Render() {
    const [open, setOpen] = useState(false);

    return (
      <Collapsible open={open} onOpenChange={setOpen}>
        <Collapsible.Trigger>
          <span>{open ? 'Less' : 'More'} information</span>
          {open ? <Minus aria-hidden="true" /> : <Plus aria-hidden="true" />}
        </Collapsible.Trigger>
        <Collapsible.Content>
          <p>The open state is owned by the parent component.</p>
        </Collapsible.Content>
      </Collapsible>
    );
  },
};

export const LongText: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Collapsibles adapt smoothly to long content sections.',
      },
    },
  },
  render: () => (
    <Collapsible>
      <Collapsible.Trigger>Read the full description</Collapsible.Trigger>
      <Collapsible.Content>
        <div>
          <p>
            Notable components are designed to be expressive, coherent, and
            accessible. Each disclosure keeps its content in the document so
            that state survives toggling, while the visible height animates
            smoothly between the collapsed and expanded states.
          </p>
          <p>
            Long content scrolls with the page rather than inside the
            disclosure, so consumers can place any amount of material inside the
            content region without constraining its height.
          </p>
          <p>
            Layout, spacing, and borders are left to the consumer, which keeps
            the base component visually neutral and composable across different
            surfaces.
          </p>
        </div>
      </Collapsible.Content>
    </Collapsible>
  ),
};

export const Multiple: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Multiple independent collapsible sections stacked together.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'grid', gap: '8px' }}>
      <Collapsible>
        <Collapsible.Trigger>First section</Collapsible.Trigger>
        <Collapsible.Content>
          <p>Content of the first section.</p>
        </Collapsible.Content>
      </Collapsible>
      <Collapsible defaultOpen>
        <Collapsible.Trigger>Second section</Collapsible.Trigger>
        <Collapsible.Content>
          <p>Content of the second section, initially open.</p>
        </Collapsible.Content>
      </Collapsible>
      <Collapsible>
        <Collapsible.Trigger>Third section</Collapsible.Trigger>
        <Collapsible.Content>
          <p>Content of the third section.</p>
        </Collapsible.Content>
      </Collapsible>
    </div>
  ),
};

export const Nested: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Collapsibles can be nested inside one another.',
      },
    },
  },
  render: () => (
    <Collapsible defaultOpen>
      <Collapsible.Trigger>Project</Collapsible.Trigger>
      <Collapsible.Content>
        <div style={{ display: 'grid', gap: '8px', paddingBlock: '8px' }}>
          <Collapsible>
            <Collapsible.Trigger>Components</Collapsible.Trigger>
            <Collapsible.Content>
              <p>Button, Input, Tooltip, and Collapsible.</p>
            </Collapsible.Content>
          </Collapsible>
          <Collapsible>
            <Collapsible.Trigger>Guidelines</Collapsible.Trigger>
            <Collapsible.Content>
              <p>Principles, foundations, patterns, and components.</p>
            </Collapsible.Content>
          </Collapsible>
        </div>
      </Collapsible.Content>
    </Collapsible>
  ),
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Collapsibles can be disabled in either closed or open states.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'grid', gap: '8px' }}>
      <Collapsible disabled>
        <Collapsible.Trigger>Unavailable section</Collapsible.Trigger>
        <Collapsible.Content>
          <p>This content cannot be opened while the disclosure is disabled.</p>
        </Collapsible.Content>
      </Collapsible>
      <Collapsible disabled defaultOpen>
        <Collapsible.Trigger>Locked open section</Collapsible.Trigger>
        <Collapsible.Content>
          <p>This content stays open and cannot be collapsed.</p>
        </Collapsible.Content>
      </Collapsible>
    </div>
  ),
};
