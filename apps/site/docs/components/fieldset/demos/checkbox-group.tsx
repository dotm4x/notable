'use client';

import { CheckboxGroup, Field, Fieldset } from '@dotm4x/one/components';

export default function CheckboxGroupExample() {
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
        <CheckboxGroup label="Notifications" defaultValue={['email']}>
          <CheckboxGroup.Item value="email" label="Email notifications" />
          <CheckboxGroup.Item value="push" label="Push notifications" />
        </CheckboxGroup>
      </Fieldset>
    </div>
  );
}
