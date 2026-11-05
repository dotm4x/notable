'use client';

import { Field, Fieldset } from '@dotm4x/one/components';

export default function Default() {
  return (
    <div style={{ width: '100%', maxWidth: '320px' }}>
      <Fieldset>
        <Fieldset.Legend>Contact</Fieldset.Legend>
        <Field.Root>
          <Field.Label>Email</Field.Label>
          <Field.Box>
            <Field.Control type="email" placeholder="you@example.com" />
          </Field.Box>
        </Field.Root>
        <Field.Root>
          <Field.Label>Phone</Field.Label>
          <Field.Box>
            <Field.Control type="tel" placeholder="+1 555 0100" />
          </Field.Box>
        </Field.Root>
      </Fieldset>
    </div>
  );
}
