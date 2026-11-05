'use client';

import { Avatar } from '@dotm4x/one/components';

const sizes = [
  { size: 'small', initials: 'SM' },
  { size: 'medium', initials: 'MD' },
  { size: 'large', initials: 'LG' },
  { size: 'extra-large', initials: 'XL' },
] as const;

export default function Sizes() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      {sizes.map(({ size, initials }) => (
        <Avatar key={size} size={size} aria-label={`${size} avatar`}>
          <Avatar.Fallback>{initials}</Avatar.Fallback>
        </Avatar>
      ))}
    </div>
  );
}
