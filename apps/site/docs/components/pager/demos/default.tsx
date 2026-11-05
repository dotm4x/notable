'use client';

import { Pager } from '@dotm4x/one/components';

export default function Default() {
  return (
    <Pager
      next={{ href: '#components', label: 'Components' }}
      previous={{ href: '#installation', label: 'Installation' }}
    />
  );
}
