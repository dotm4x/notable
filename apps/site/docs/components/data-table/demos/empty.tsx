'use client';

import {
  DataTable,
  DataTableColumnHeader,
  type ColumnDef,
  type DataTableFeatures,
} from '@dotm4x/one/components';

interface Payment {
  id: string;
  email: string;
  amount: number;
}

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
    accessorKey: 'amount',
    header: 'Amount',
    sortFn: 'alphanumeric',
  },
];

export default function EmptyTable() {
  return (
    <DataTable
      columns={columns}
      data={[]}
      emptyState="No payments have been created yet."
      filterColumn="email"
    />
  );
}
