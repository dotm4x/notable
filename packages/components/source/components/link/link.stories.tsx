import type { Meta, StoryObj } from '@storybook/react-vite';
import { Link } from './link.js';

const meta = {
  title: 'Components/Link',
  component: Link,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    children: 'Read the documentation',
    href: '#',
    arrow: false,
  },
  argTypes: {
    arrow: {
      control: 'boolean',
      description: 'Shows a trailing arrow after the label.',
    },
  },
} satisfies Meta<typeof Link>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The default hyperlink style.',
      },
    },
  },
};

export const Arrow: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Links can include a trailing arrow indicator.',
      },
    },
  },
  args: {
    arrow: true,
  },
};

export const Inline: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Links can be embedded inline within body text paragraphs.',
      },
    },
  },
  render: (args) => (
    <p>
      Notable is a design language. <Link {...args}>Read the guidelines</Link>{' '}
      to see how components should behave.
    </p>
  ),
};

export const External: Story = {
  parameters: {
    docs: {
      description: {
        story: 'External links opening in a new tab with rel attributes.',
      },
    },
  },
  args: {
    children: 'Open the repository',
    href: 'https://github.com',
    target: '_blank',
    rel: 'noreferrer',
    arrow: true,
  },
};
