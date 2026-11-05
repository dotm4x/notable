'use client';

import {
  Button,
  CheckboxGroup,
  Fieldset,
  Form,
  Input,
  RadioGroup,
} from '@dotm4x/one/components';

export default function Grouped() {
  return (
    <Form>
      <Input
        label="Workspace name"
        name="workspace"
        defaultValue="Acme Studio"
      />
      <Fieldset.Root>
        <Fieldset.Legend>Notifications</Fieldset.Legend>
        <CheckboxGroup label="Topics" defaultValue={['product']}>
          <CheckboxGroup.Item
            name="topics"
            value="product"
            label="Product updates"
          />
          <CheckboxGroup.Item name="topics" value="tips" label="Weekly tips" />
        </CheckboxGroup>
        <RadioGroup label="Frequency" name="frequency" defaultValue="daily">
          <RadioGroup.Item value="daily" label="Daily" />
          <RadioGroup.Item value="weekly" label="Weekly" />
        </RadioGroup>
      </Fieldset.Root>
      <Button type="submit">Save preferences</Button>
    </Form>
  );
}
