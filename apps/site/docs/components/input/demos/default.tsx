'use client';

import { Input } from '@dotm4x/one/components';

export default function Default() {
  return (
    <div style={{ inlineSize: '100%', maxInlineSize: '24rem' }}>
      <Input
        label="Email address"
        name="email"
        type="email"
        placeholder="you@example.com"
        description="We will only use this to contact you."
      />
    </div>
  );
}
