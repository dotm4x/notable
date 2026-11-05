'use client';

import { Pagination } from '@dotm4x/one/components';
import { useState } from 'react';

export default function FirstLast() {
  const [page, setPage] = useState(6);

  return (
    <Pagination
      page={page}
      pageCount={20}
      showFirstLast
      onPageChange={setPage}
    />
  );
}
