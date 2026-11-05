'use client';

import { Pagination } from '@dotm4x/one/components';
import { useState } from 'react';

export default function Small() {
  const [page, setPage] = useState(2);

  return (
    <Pagination page={page} pageCount={8} size="small" onPageChange={setPage} />
  );
}
