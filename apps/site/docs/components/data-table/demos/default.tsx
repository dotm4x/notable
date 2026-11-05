'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@dotm4x/one/components';
import {
  DataTable,
  DataTableColumnHeader,
  type DataTableFeatures,
} from '@dotm4x/one/data-table';

interface Payment {
  id: string;
  email: string;
  amount: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
}

const payments: Payment[] = Array.from({ length: 18 }, (_, index) => ({
  id: `payment-${index + 1}`,
  email: `user${String(index + 1).padStart(2, '0')}@example.com`,
  amount: 100 + index * 17,
  status:
    index % 4 === 0
      ? 'pending'
      : index % 4 === 1
        ? 'processing'
        : index % 4 === 2
          ? 'success'
          : 'failed',
}));

const statusVariant = {
  pending: 'warning',
  processing: 'info',
  success: 'success',
  failed: 'danger',
} as const;

const columns: ColumnDef<DataTableFeatures, Payment>[] = [
  {
    accessorKey: 'email',
    filterFn: 'includesString',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    sortFn: 'text',
  },
  {
    accessorKey: 'status',
    cell: ({ row }) => (
      <Badge variant={statusVariant[row.original.status]}>
        {row.original.status}
      </Badge>
    ),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    sortFn: 'text',
  },
  {
    accessorKey: 'amount',
    cell: ({ row }) =>
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(row.original.amount),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    sortFn: 'alphanumeric',
  },
];

export default function Default() {
  return (
    <DataTable
      columns={columns}
      data={payments}
      enableRowSelection
      filterColumn="email"
      pageSize={10}
    />
  );
}
