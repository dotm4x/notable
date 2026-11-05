'use client';

import { Field } from '@dotm4x/one/components';

export default function CustomControl() {
  return (
    <div style={{ width: '100%', maxWidth: '320px' }}>
      <Field.Root>
        <Field.Label>Review notes</Field.Label>
        <Field.Box>
          <Field.Control
            render={<textarea rows={3} />}
            placeholder="Add context for the reviewer"
          />
        </Field.Box>
        <Field.Description>
          Shown to the reviewer with your changes.
        </Field.Description>
      </Field.Root>
    </div>
  );
}
