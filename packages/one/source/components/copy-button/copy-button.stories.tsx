import type { Meta, StoryObj } from '@storybook/react-vite';
import { CopyButton } from './copy-button.js';

const meta = {
  title: 'Components/CopyButton',
  component: CopyButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    showLabel: { control: 'boolean' },
    size: {
      control: 'inline-radio',
      options: ['small', 'medium', 'large'],
    },
    variant: {
      control: 'inline-radio',
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
    },
  },
  args: {
    value: 'pnpm add @dotm4x/one',
    label: 'Copy',
    copiedLabel: 'Copied',
    showLabel: true,
    size: 'small',
    variant: 'ghost',
  },
} satisfies Meta<typeof CopyButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const IconOnly: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Icon-only buttons keep an accessible name that changes to Copied.',
      },
    },
  },
  args: {
    showLabel: false,
  },
};

export const CustomLabels: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Labels can be localized without changing the component.',
      },
    },
  },
  args: {
    label: 'Copiar',
    copiedLabel: 'Copiado',
  },
};

export const Outline: Story = {
  args: {
    size: 'medium',
    variant: 'outline',
  },
};
