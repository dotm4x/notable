'use client';

import {
  Badge,
  Button,
  DataTable,
  DataTableColumnHeader,
  DropdownMenu,
  type ColumnDef,
  type DataTableFeatures,
} from '@dotm4x/one/components';
import { MoreHorizontal } from '@dotm4x/one/icons';

interface Payment {
  id: string;
  email: string;
  amount: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
}

const payments: Payment[] = Array.from({ length: 14 }, (_, index) => ({
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
  {
    id: 'actions',
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenu.Trigger>
          <Button
            aria-label={`Open menu for ${row.original.email}`}
            size="small"
            variant="ghost"
          >
            <MoreHorizontal aria-hidden="true" />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end">
          <DropdownMenu.Item
            onClick={() => navigator.clipboard.writeText(row.original.id)}
          >
            Copy payment ID
          </DropdownMenu.Item>
          <DropdownMenu.Item>View details</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    ),
    enableHiding: false,
    header: 'Actions',
  },
];

export default function RowActions() {
  return (
    <DataTable
      columns={columns}
      data={payments}
      filterColumn="email"
      pageSize={10}
    />
  );
}
