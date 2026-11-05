'use client';

import { Button, Tooltip } from '@dotm4x/one/components';

export default function Delay() {
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <Tooltip content="Shown immediately" delay={0}>
        <Button variant="outline">No delay</Button>
      </Tooltip>
      <Tooltip content="Shown after one second" delay={1000}>
        <Button variant="outline">One second</Button>
      </Tooltip>
    </div>
  );
}
