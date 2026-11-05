'use client';

import { Toggle } from '@dotm4x/one/components';
import { Bold, Italic, Underline } from '@dotm4x/one/icons';

export default function IconOnly() {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <Toggle aria-label="Bold" defaultPressed>
        <Bold aria-hidden="true" />
      </Toggle>
      <Toggle aria-label="Italic" variant="outline">
        <Italic aria-hidden="true" />
      </Toggle>
      <Toggle aria-label="Underline" variant="outline">
        <Underline aria-hidden="true" />
      </Toggle>
    </div>
  );
}
