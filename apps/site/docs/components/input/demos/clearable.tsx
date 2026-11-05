'use client';

import { Button, Input } from '@dotm4x/one/components';
import { Search, X } from '@dotm4x/one/icons';
import { useState } from 'react';

export default function Clearable() {
  const [value, setValue] = useState('Quarterly report');

  return (
    <div style={{ inlineSize: '100%', maxInlineSize: '24rem' }}>
      <Input
        label="Search documents"
        placeholder="Search your documents"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        leadingIcon={<Search aria-hidden="true" />}
        trailingIcon={
          <Button
            variant="ghost"
            size="icon-small"
            aria-label="Clear search"
            onClick={() => setValue('')}
          >
            <X aria-hidden="true" />
          </Button>
        }
        trailingIconInteractive
      />
    </div>
  );
}
