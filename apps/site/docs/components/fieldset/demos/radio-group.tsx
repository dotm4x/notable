'use client';

import { Field, Fieldset, RadioGroup } from '@dotm4x/one/components';

export default function RadioGroupExample() {
  return (
    <div style={{ width: '100%', maxWidth: '320px' }}>
      <Fieldset>
        <Fieldset.Legend>Account</Fieldset.Legend>
        <Field.Root>
          <Field.Label>Display name</Field.Label>
          <Field.Box>
            <Field.Control defaultValue="Ana Torres" />
          </Field.Box>
        </Field.Root>
        <RadioGroup label="Email digest" defaultValue="daily">
          <RadioGroup.Item value="instant" label="Send each message" />
          <RadioGroup.Item value="daily" label="Daily digest" />
          <RadioGroup.Item value="weekly" label="Weekly digest" />
        </RadioGroup>
      </Fieldset>
    </div>
  );
}
