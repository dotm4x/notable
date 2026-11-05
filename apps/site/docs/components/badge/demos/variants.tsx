'use client';

import { Badge, type BadgeVariant } from '@dotm4x/one/components';

const variants: BadgeVariant[] = [
  'default',
  'secondary',
  'outline',
  'success',
  'warning',
  'danger',
  'info',
];

export default function Variants() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
      {variants.map((variant) => (
        <Badge key={variant} variant={variant}>
          {variant}
        </Badge>
      ))}
    </div>
  );
}
