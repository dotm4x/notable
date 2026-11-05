'use client';

import { Progress } from '@dotm4x/one/components';

export default function Default() {
  return (
    <div style={{ inlineSize: '100%', maxInlineSize: '24rem' }}>
      <Progress aria-label="Upload progress" value={64} />
    </div>
  );
}
