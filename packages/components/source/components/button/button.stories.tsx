import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './button.js';

const meta = {
  component: Button,
  tags: ['autodocs'],
  args: {
    children: 'Button',
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
