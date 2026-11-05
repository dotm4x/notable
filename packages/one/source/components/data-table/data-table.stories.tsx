import type { ColumnDef } from '@tanstack/react-table';
import type { ReactElement } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { MoreHorizontal } from '../../icons/index.js';
import { Button } from '../button/button.js';
import { DropdownMenu } from '../dropdown-menu/dropdown-menu.js';
import { DataTable } from './data-table.js';
import { DataTableColumnHeader } from './data-table-column-header.js';
import type { DataTableFeatures } from './features.js';
import type { TDataTableProps } from './types.js';

interface Payment {
  id: string;
  email: string;
  amount: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
}

const payments: Payment[] = Array.from({ length: 24 }, (_, index) => ({
  id: `728ed52f-${index}`,
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

const columnsWithActions: ColumnDef<DataTableFeatures, Payment>[] = [
  ...columns,
  {
    id: 'actions',
    enableHiding: false,
    header: 'Actions',
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
  },
];

function PaymentDataTable(props: TDataTableProps<Payment>): ReactElement {
  return <DataTable<Payment> {...props} />;
}

const meta = {
  title: 'Components/DataTable',
  component: PaymentDataTable,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100%', maxWidth: 860, margin: '0 auto' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DataTable<Payment>>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    columns,
    data: payments,
    filterColumn: 'email',
    pageSize: 10,
  },
};

export const WithRowSelection: Story = {
  args: {
    columns,
    data: payments,
    enableRowSelection: true,
    filterColumn: 'email',
    pageSize: 10,
  },
};

export const WithRowActions: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Row actions are ordinary TanStack columns that render a DropdownMenu.',
      },
    },
  },
  args: {
    columns: columnsWithActions,
    data: payments,
    enableRowSelection: true,
    filterColumn: 'email',
    pageSize: 10,
  },
};

export const Empty: Story = {
  args: {
    columns,
    data: [],
  },
};
