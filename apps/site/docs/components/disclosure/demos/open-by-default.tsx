'use client';

import { Disclosure } from '@dotm4x/one/components';

export default function OpenByDefault() {
  return (
    <Disclosure defaultOpen title="Shipping details">
      <p>Ships within two business days.</p>
    </Disclosure>
  );
}
