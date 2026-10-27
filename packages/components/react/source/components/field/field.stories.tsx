import type { Meta, StoryObj } from '@storybook/react-vite';
import { Field } from './field.js';

const meta = {
  title: 'Components/Field',
  component: Field.Root,
  tags: ['autodocs'],
  args: {
    className: 'notable-story-field',
  },
  render: (args) => (
    <Field.Root {...args}>
      <Field.Label>Email address</Field.Label>
      <Field.Box>
        <Field.Control placeholder="you@example.com" />
      </Field.Box>
      <Field.Description>
        We will only use this to contact you.
      </Field.Description>
    </Field.Root>
  ),
} satisfies Meta<typeof Field.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Invalid: Story = {
  args: {
    invalid: true,
  },
  render: (args) => (
    <Field.Root {...args}>
      <Field.Label>Email address</Field.Label>
      <Field.Box>
        <Field.Control defaultValue="not-an-email" />
      </Field.Box>
      <Field.Error match>Enter a valid email address.</Field.Error>
    </Field.Root>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const WithCustomControl: Story = {
  render: (args) => (
    <Field.Root {...args}>
      <Field.Label>Notes</Field.Label>
      <Field.Box>
        <Field.Control render={<textarea rows={3} />} />
      </Field.Box>
      <Field.Description>Shown to the reviewer.</Field.Description>
    </Field.Root>
  ),
};
