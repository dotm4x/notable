'use client';

import { Link } from '@dotm4x/one/components';

export default function Inline() {
  return (
    <p style={{ maxInlineSize: '32rem' }}>
      One is a design language for expressive interfaces.{' '}
      <Link href="/docs/guidelines">Read the guidelines</Link> to see how
      components should behave before you compose them.
    </p>
  );
}
