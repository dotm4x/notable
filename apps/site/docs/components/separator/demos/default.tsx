'use client';

import { Separator } from '@dotm4x/one/components';

export default function Default() {
  return (
    <div style={{ width: '22rem' }}>
      <h2 style={{ margin: 0 }}>Billing</h2>
      <p style={{ color: 'var(--one-color-text-muted)' }}>
        Invoices, receipts, and payment methods.
      </p>
      <Separator />
      <p style={{ margin: 0 }}>Your next invoice is issued on 1 December.</p>
    </div>
  );
}
