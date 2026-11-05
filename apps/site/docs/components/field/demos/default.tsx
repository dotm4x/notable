'use client';

import { Field } from '@dotm4x/one/components';

export default function Default() {
  return (
    <div style={{ width: '100%', maxWidth: '320px' }}>
      <Field.Root>
        <Field.Label>Email address</Field.Label>
        <Field.Box>
          <Field.Control type="email" placeholder="you@example.com" />
        </Field.Box>
        <Field.Description>
          We will only use this to contact you.
        </Field.Description>
      </Field.Root>
    </div>
  );
}
