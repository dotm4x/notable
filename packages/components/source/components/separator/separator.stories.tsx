import type { Meta, StoryObj } from '@storybook/react-vite';
import { Separator } from './separator.js';

const meta = {
  parameters: {
    layout: 'centered',
  },
  title: 'Components/Separator',
  component: Separator,
  tags: ['autodocs'],
  args: {
    orientation: 'horizontal',
  },
} satisfies Meta<typeof Separator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The default horizontal separator line.',
      },
    },
  },
  render: (args) => (
    <div style={{ width: 320 }}>
      <p>Content above the separator.</p>
      <Separator {...args} />
      <p>Content below the separator.</p>
    </div>
  ),
};

export const Vertical: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Separators support vertical orientation between inline items.',
      },
    },
  },
  args: {
    orientation: 'vertical',
  },
  render: (args) => (
    <div
      style={{ display: 'flex', alignItems: 'stretch', gap: 16, height: 80 }}
    >
      <span>Left</span>
      <Separator {...args} />
      <span>Right</span>
    </div>
  ),
};

export const Custom: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Separators support custom thickness, semantic colors, and custom CSS color values.',
      },
    },
  },
  render: (args) => (
    <div style={{ display: 'grid', gap: 24, width: 320 }}>
      <Separator {...args} thickness={4} color="strong" />
      <Separator
        {...args}
        thickness="0.5rem"
        color="var(--notable-color-primary)"
      />
      <div
        style={{ display: 'flex', alignItems: 'stretch', gap: 16, height: 48 }}
      >
        <span>Thick</span>
        <Separator
          {...args}
          orientation="vertical"
          thickness={4}
          color="strong"
        />
        <span>Subtle</span>
        <Separator {...args} orientation="vertical" color="subtle" />
        <span>Default</span>
      </div>
    </div>
  ),
};

export const Semantic: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Separators can be decorative (hidden from screen readers) or semantic (exposed to assistive technology).',
      },
    },
  },
  render: (args) => (
    <div style={{ display: 'grid', gap: 24, width: 320 }}>
      <div>
        <p>Decorative (hidden from assistive technology):</p>
        <Separator {...args} decorative />
      </div>
      <div>
        <p>Semantic (exposed as a separator):</p>
        <Separator {...args} />
      </div>
    </div>
  ),
};

export const Composition: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Separators used to structure content sections in articles and cards.',
      },
    },
  },
  render: (args) => (
    <article style={{ display: 'grid', gap: 16, width: 360 }}>
      <header>
        <h3>Project settings</h3>
        <p>Manage how this project is shared and built.</p>
      </header>
      <Separator {...args} />
      <section>
        <h4>General</h4>
        <p>Name, description, and visibility.</p>
      </section>
      <Separator {...args} />
      <div
        style={{ display: 'flex', alignItems: 'stretch', gap: 16, height: 56 }}
      >
        <span>Build</span>
        <Separator orientation="vertical" decorative />
        <span>Deploy</span>
      </div>
      <Separator {...args} />
      <footer>
        <small>Last updated today.</small>
      </footer>
    </article>
  ),
};
