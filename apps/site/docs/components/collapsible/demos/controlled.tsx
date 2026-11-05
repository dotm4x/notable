'use client';

import { useState } from 'react';
import { Collapsible } from '@dotm4x/one/components';

export default function Controlled() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <Collapsible open={open} onOpenChange={setOpen}>
        <Collapsible.Trigger>Release notes</Collapsible.Trigger>
        <Collapsible.Content>
          <p>Version 2.4 adds keyboard navigation and theme refinements.</p>
        </Collapsible.Content>
      </Collapsible>
      <p style={{ margin: 0 }}>
        The section is {open ? 'expanded' : 'collapsed'}.
      </p>
    </div>
  );
}
