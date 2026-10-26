import { AtSign, Search, X } from 'lucide-react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '../button/button.js';
import { Input } from './input.js';

function ClearableSearchExample() {
  const [value, setValue] = useState('Notable');

  return (
    <Input
      label="Search"
      value={value}
      onChange={(event) => setValue(event.target.value)}
      leadingIcon={<Search />}
      trailingIcon={
        <Button
          variant="ghost"
          size="icon-small"
          aria-label="Clear search"
          onClick={() => setValue('')}
        >
          <X aria-hidden="true" />
        </Button>
      }
      trailingIconInteractive
    />
  );
}

const meta = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  args: {
    label: 'Email address',
    placeholder: 'you@example.com',
    description: 'We will only use this to contact you.',
  },
  argTypes: {
    type: {
      control: 'select',
      options: [
        'text',
        'email',
        'password',
        'search',
        'number',
        'tel',
        'url',
        'date',
      ],
    },
    leadingIcon: { control: false },
    trailingIcon: { control: false },
    leadingIconInteractive: { control: false },
    trailingIconInteractive: { control: false },
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithIcons: Story = {
  args: {
    label: 'Search',
    placeholder: 'Search your projects',
    description: undefined,
    leadingIcon: <Search aria-hidden="true" />,
    trailingIcon: <AtSign aria-hidden="true" />,
  },
};

export const ClearableSearch: Story = {
  render: () => <ClearableSearchExample />,
};

export const Invalid: Story = {
  args: {
    label: 'Email address',
    defaultValue: 'not-an-email',
    invalid: true,
    error: 'Enter a valid email address.',
    description: undefined,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Email address',
    defaultValue: 'alex@example.com',
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    label: 'Account ID',
    value: 'usr_12345',
    readOnly: true,
    description: 'This value cannot be changed.',
  },
};

export const NativeTypes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '24px', maxWidth: '24rem' }}>
      <Input label="Email" type="email" placeholder="you@example.com" />
      <Input label="Password" type="password" autoComplete="current-password" />
      <Input label="Search" type="search" placeholder="Search projects" />
      <Input label="Quantity" type="number" min={1} max={10} defaultValue={1} />
      <Input label="Start date" type="date" />
    </div>
  ),
};

export const FileUpload: Story = {
  args: {
    label: 'Profile photo',
    type: 'file',
    accept: 'image/*',
    description: 'Choose an image file to upload.',
  },
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '24px', maxWidth: '24rem' }}>
      <Input label="Default" placeholder="Enter a value" />
      <Input label="Disabled" placeholder="Unavailable" disabled />
      <Input label="Read only" value="Locked value" readOnly />
      <Input
        label="Invalid"
        value="Incorrect value"
        error="Please check this value."
      />
    </div>
  ),
};
