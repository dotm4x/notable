'use client';

import { Field } from '@dotm4x/one/components';

export default function Invalid() {
  return (
    <div style={{ width: '100%', maxWidth: '320px' }}>
      <Field.Root invalid>
        <Field.Label>Email address</Field.Label>
        <Field.Box>
          <Field.Control defaultValue="not-an-email" />
        </Field.Box>
        <Field.Error match>Enter a valid email address.</Field.Error>
      </Field.Root>
    </div>
  );
}
