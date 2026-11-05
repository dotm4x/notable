'use client';

import { Pagination } from '@dotm4x/one/components';
import { useState } from 'react';

export default function Composed() {
  const [page, setPage] = useState(4);

  return (
    <Pagination page={page} pageCount={24} onPageChange={setPage}>
      <Pagination.Previous>Back</Pagination.Previous>
      <Pagination.Items />
      <Pagination.Next>Next</Pagination.Next>
    </Pagination>
  );
}
