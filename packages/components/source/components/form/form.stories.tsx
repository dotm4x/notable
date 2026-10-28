import type { Meta, StoryObj } from '@storybook/react-vite';
import type { FormEvent } from 'react';
import { Button } from '../button/button.js';
import { Checkbox } from '../checkbox/checkbox.js';
import { CheckboxGroup } from '../checkbox/checkbox-group.js';
import { Fieldset } from '../fieldset/fieldset.js';
import { Input } from '../input/input.js';
import { RadioGroup, RadioGroupItem } from '../radio-group/radio-group.js';
import { Form } from './form.js';

const meta = {
  title: 'Components/Form',
  component: Form,
  tags: ['autodocs'],
  render: (args) => (
    <Form {...args}>
      <Input label="Email" type="email" required />
      <Button type="submit">Subscribe</Button>
    </Form>
  ),
} satisfies Meta<typeof Form>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithSubmitHandler: Story = {
  render: () => (
    <Form
      onSubmit={(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        window.alert(JSON.stringify(Object.fromEntries(data)));
      }}
    >
      <Input label="Name" name="name" required />
      <Input label="Email" name="email" type="email" required />
      <Button type="submit">Save</Button>
    </Form>
  ),
};

export const WithGroups: Story = {
  render: () => (
    <Form
      onSubmit={(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        window.alert(
          JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))),
        );
      }}
    >
      <Input label="Name" name="name" />
      <Fieldset.Root>
        <Fieldset.Legend>Preferences</Fieldset.Legend>
        <CheckboxGroup label="Topics" defaultValue={['news']}>
          <CheckboxGroup.Item name="topics" value="news" label="News" />
          <CheckboxGroup.Item name="topics" value="tips" label="Tips" />
        </CheckboxGroup>
        <RadioGroup label="Frequency" name="frequency" defaultValue="daily">
          <RadioGroupItem value="daily" label="Daily" />
          <RadioGroupItem value="weekly" label="Weekly" />
        </RadioGroup>
      </Fieldset.Root>
      <Button type="submit">Save</Button>
    </Form>
  ),
};

export const WithReset: Story = {
  render: () => (
    <Form>
      <Input label="Email" name="email" defaultValue="ana@example.com" />
      <Checkbox name="consent" label="I agree" />
      <div style={{ display: 'flex', gap: 'var(--notable-spacing-2)' }}>
        <Button type="submit">Save</Button>
        <Button type="reset">Reset</Button>
      </div>
    </Form>
  ),
};
