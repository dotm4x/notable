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
  parameters: {
    layout: 'centered',
  },
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

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The default text input field with label and description.',
      },
    },
  },
};

export const Icons: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Inputs support leading and trailing decorative icons.',
      },
    },
  },
  args: {
    label: 'Search',
    placeholder: 'Search your projects',
    description: undefined,
    leadingIcon: <Search aria-hidden="true" />,
    trailingIcon: <AtSign aria-hidden="true" />,
  },
};

export const Clearable: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Inputs support interactive trailing controls such as clear buttons.',
      },
    },
  },
  render: () => <ClearableSearchExample />,
};

export const Invalid: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Inputs support invalid error states and inline error messages.',
      },
    },
  },
  args: {
    label: 'Email address',
    defaultValue: 'not-an-email',
    invalid: true,
    error: 'Enter a valid email address.',
    description: undefined,
  },
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Inputs can be disabled to prevent user interaction.',
      },
    },
  },
  args: {
    label: 'Email address',
    defaultValue: 'alex@example.com',
    disabled: true,
  },
};

export const ReadOnly: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Inputs support read-only mode for fixed values.',
      },
    },
  },
  args: {
    label: 'Account ID',
    value: 'usr_12345',
    readOnly: true,
    description: 'This value cannot be changed.',
  },
};

export const Types: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Inputs support various native HTML types such as email, password, search, number, and date.',
      },
    },
  },
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

export const File: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Inputs support file selection mode.',
      },
    },
  },
  args: {
    label: 'Profile photo',
    type: 'file',
    accept: 'image/*',
    description: 'Choose an image file to upload.',
  },
};

export const States: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A comparison view of default, disabled, read-only, and invalid input states.',
      },
    },
  },
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
