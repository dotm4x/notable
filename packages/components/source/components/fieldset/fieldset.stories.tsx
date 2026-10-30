import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from '../checkbox/checkbox.js';
import { CheckboxGroup } from '../checkbox/checkbox-group.js';
import { Field } from '../field/field.js';
import { RadioGroup, RadioGroupItem } from '../radio-group/radio-group.js';
import { Fieldset } from './fieldset.js';

const meta = {
  parameters: {
    layout: 'centered',
  },
  title: 'Components/Fieldset',
  component: Fieldset.Root,
  tags: ['autodocs'],
  render: (args) => (
    <Fieldset.Root {...args}>
      <Fieldset.Legend>Contact</Fieldset.Legend>
      <Field.Root>
        <Field.Label>Email</Field.Label>
        <Field.Box>
          <Field.Control type="email" />
        </Field.Box>
      </Field.Root>
      <Field.Root>
        <Field.Label>Phone</Field.Label>
        <Field.Box>
          <Field.Control type="tel" />
        </Field.Box>
      </Field.Root>
    </Fieldset.Root>
  ),
} satisfies Meta<typeof Fieldset.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The default fieldset grouping related fields under a shared legend.',
      },
    },
  },
};

export const Fields: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Fieldsets can group multiple form fields together.',
      },
    },
  },
  render: () => (
    <Fieldset.Root>
      <Fieldset.Legend>Shipping address</Fieldset.Legend>
      <Field.Root>
        <Field.Label>Street</Field.Label>
        <Field.Box>
          <Field.Control />
        </Field.Box>
      </Field.Root>
      <Field.Root>
        <Field.Label>City</Field.Label>
        <Field.Box>
          <Field.Control />
        </Field.Box>
      </Field.Root>
    </Fieldset.Root>
  ),
};

export const Checkboxes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Fieldsets can combine fields with checkbox groups.',
      },
    },
  },
  render: () => (
    <Fieldset.Root>
      <Fieldset.Legend>Account</Fieldset.Legend>
      <Field.Root>
        <Field.Label>Display name</Field.Label>
        <Field.Box>
          <Field.Control defaultValue="Ana Torres" />
        </Field.Box>
      </Field.Root>
      <CheckboxGroup label="Notifications" defaultValue={['email']}>
        <CheckboxGroup.Item value="email" label="Email notifications" />
        <CheckboxGroup.Item value="push" label="Push notifications" />
      </CheckboxGroup>
    </Fieldset.Root>
  ),
};

export const Radios: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Fieldsets can combine fields with radio groups.',
      },
    },
  },
  render: () => (
    <Fieldset.Root>
      <Fieldset.Legend>Account</Fieldset.Legend>
      <Field.Root>
        <Field.Label>Display name</Field.Label>
        <Field.Box>
          <Field.Control defaultValue="Ana Torres" />
        </Field.Box>
      </Field.Root>
      <RadioGroup label="Digest" defaultValue="daily">
        <RadioGroupItem value="instant" label="Instant" />
        <RadioGroupItem value="daily" label="Daily digest" />
        <RadioGroupItem value="weekly" label="Weekly summary" />
      </RadioGroup>
    </Fieldset.Root>
  ),
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Disabling a fieldset disables all controls inside it.',
      },
    },
  },
  render: () => (
    <Fieldset.Root disabled>
      <Fieldset.Legend>Billing</Fieldset.Legend>
      <Field.Root>
        <Field.Label>Card number</Field.Label>
        <Field.Box>
          <Field.Control />
        </Field.Box>
      </Field.Root>
      <Checkbox label="Save card for future purchases" />
    </Fieldset.Root>
  ),
};

export const Form: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Multiple fieldsets combined into a complete form layout.',
      },
    },
  },
  render: () => (
    <form
      onSubmit={(event) => event.preventDefault()}
      style={{ display: 'grid', gap: '24px', maxWidth: '420px' }}
    >
      <Fieldset.Root>
        <Fieldset.Legend>Account</Fieldset.Legend>
        <Field.Root>
          <Field.Label>Username</Field.Label>
          <Field.Box>
            <Field.Control autoComplete="username" />
          </Field.Box>
        </Field.Root>
        <Field.Root>
          <Field.Label>Email</Field.Label>
          <Field.Box>
            <Field.Control type="email" autoComplete="email" />
          </Field.Box>
          <Field.Description>We use it for sign-in alerts.</Field.Description>
        </Field.Root>
      </Fieldset.Root>
      <Fieldset.Root>
        <Fieldset.Legend>Notifications</Fieldset.Legend>
        <CheckboxGroup label="Channels" defaultValue={['email']}>
          <CheckboxGroup.Item value="email" label="Email" />
          <CheckboxGroup.Item value="push" label="Push" />
        </CheckboxGroup>
        <RadioGroup label="Digest" defaultValue="weekly">
          <RadioGroupItem value="daily" label="Daily" />
          <RadioGroupItem value="weekly" label="Weekly" />
        </RadioGroup>
      </Fieldset.Root>
    </form>
  ),
};
