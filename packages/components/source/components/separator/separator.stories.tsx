import type { Meta, StoryObj } from '@storybook/react-vite';
import { Separator } from './separator.js';

const meta = {
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
  render: (args) => (
    <div style={{ width: 320 }}>
      <p>Content above the separator.</p>
      <Separator {...args} />
      <p>Content below the separator.</p>
    </div>
  ),
};

export const Vertical: Story = {
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

export const CustomThicknessAndColor: Story = {
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

export const DecorativeVsSemantic: Story = {
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
