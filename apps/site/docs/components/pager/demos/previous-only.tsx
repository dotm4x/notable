'use client';

import { Pager } from '@dotm4x/one/components';

export default function PreviousOnly() {
  return <Pager previous={{ href: '#installation', label: 'Installation' }} />;
}
