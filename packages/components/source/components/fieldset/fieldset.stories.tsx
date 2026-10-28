import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from '../checkbox/checkbox.js';
import { CheckboxGroup } from '../checkbox/checkbox-group.js';
import { Field } from '../field/field.js';
import { RadioGroup, RadioGroupItem } from '../radio-group/radio-group.js';
import { Fieldset } from './fieldset.js';

const meta = {
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

export const Default: Story = {};

export const WithFields: Story = {
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

export const WithCheckboxGroup: Story = {
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
export const WithRadioGroup: Story = {
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

export const RealisticForm: Story = {
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
