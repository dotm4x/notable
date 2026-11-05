'use client';

import { Toggle } from '@dotm4x/one/components';

export default function Variants() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      <Toggle defaultPressed>Default pressed</Toggle>
      <Toggle>Default unpressed</Toggle>
      <Toggle variant="outline" defaultPressed>
        Outline pressed
      </Toggle>
      <Toggle variant="outline">Outline unpressed</Toggle>
    </div>
  );
}
