'use client';

import { Button, NumberFlow } from '@dotm4x/one/components';
import { Minus, Plus } from '@dotm4x/one/icons';
import { useState } from 'react';

export default function Interactive() {
  const [value, setValue] = useState(42);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--one-spacing-3)',
      }}
    >
      <Button
        variant="outline"
        size="icon"
        aria-label="Decrease value"
        onClick={() => setValue((current) => current - 1)}
      >
        <Minus aria-hidden="true" />
      </Button>
      <NumberFlow value={value} />
      <Button
        variant="outline"
        size="icon"
        aria-label="Increase value"
        onClick={() => setValue((current) => current + 1)}
      >
        <Plus aria-hidden="true" />
      </Button>
    </div>
  );
}
