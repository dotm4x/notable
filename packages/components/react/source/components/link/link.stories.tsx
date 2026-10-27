import type { Meta, StoryObj } from '@storybook/react-vite';
import { Link } from './link.js';

const meta = {
  title: 'Components/Link',
  component: Link,
  tags: ['autodocs'],
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

export const Default: Story = {};

export const WithArrow: Story = {
  args: {
    arrow: true,
  },
};

export const InText: Story = {
  render: (args) => (
    <p>
      Notable is a design language. <Link {...args}>Read the guidelines</Link>{' '}
      to see how components should behave.
    </p>
  ),
};

export const External: Story = {
  args: {
    children: 'Open the repository',
    href: 'https://github.com',
    target: '_blank',
    rel: 'noreferrer',
    arrow: true,
  },
};
