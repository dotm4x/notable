'use client';

import { Input } from '@dotm4x/one/components';

export default function Invalid() {
  return (
    <div style={{ inlineSize: '100%', maxInlineSize: '24rem' }}>
      <Input
        label="Email address"
        name="email"
        type="email"
        defaultValue="not-an-email"
        error="Enter a valid email address."
      />
    </div>
  );
}
