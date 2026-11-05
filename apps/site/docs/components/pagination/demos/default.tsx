'use client';

import { Pagination } from '@dotm4x/one/components';
import { useState } from 'react';

export default function Default() {
  const [page, setPage] = useState(3);

  return <Pagination page={page} pageCount={12} onPageChange={setPage} />;
}
