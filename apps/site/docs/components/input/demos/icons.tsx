'use client';

import { Input } from '@dotm4x/one/components';
import { AtSign, CheckCircle } from '@dotm4x/one/icons';

export default function Icons() {
  return (
    <div style={{ inlineSize: '100%', maxInlineSize: '24rem' }}>
      <Input
        label="Email address"
        defaultValue="ana@example.com"
        leadingIcon={<AtSign aria-hidden="true" />}
        trailingIcon={<CheckCircle aria-hidden="true" />}
      />
    </div>
  );
}
