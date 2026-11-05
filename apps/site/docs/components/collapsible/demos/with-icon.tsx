'use client';

import { Collapsible } from '@dotm4x/one/components';
import { ChevronDown } from '@dotm4x/one/icons';

export default function WithIcon() {
  return (
    <Collapsible defaultOpen>
      <Collapsible.Trigger>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          Billing history
          <ChevronDown size={16} aria-hidden="true" />
        </span>
      </Collapsible.Trigger>
      <Collapsible.Content>
        <p>Your last invoice was paid on 4 March 2025.</p>
      </Collapsible.Content>
    </Collapsible>
  );
}
