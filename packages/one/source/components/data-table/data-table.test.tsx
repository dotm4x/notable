import type { ColumnDef } from '@tanstack/react-table';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { DataTable } from './data-table.js';
import { DataTableColumnHeader } from './data-table-column-header.js';
import type { DataTableFeatures } from './features.js';

interface Payment {
  id: string;
  email: string;
  amount: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
}

const payments: Payment[] = Array.from({ length: 12 }, (_, index) => ({
  id: `payment-${index + 1}`,
  email: `user${String(index + 1).padStart(2, '0')}@example.com`,
  amount: 100 + index * 10,
  status: index % 3 === 0 ? 'pending' : index % 3 === 1 ? 'success' : 'failed',
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
    accessorKey: 'amount',
    cell: ({ row }) => `$${row.original.amount.toFixed(2)}`,
    header: 'Amount',
    sortFn: 'alphanumeric',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    sortFn: 'text',
  },
];

function bodyRows() {
  return within(screen.getByRole('table')).getAllByRole('row').slice(1);
}

describe('DataTable', () => {
  it('renders columns and paginates rows', async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} data={payments} pageSize={5} />);

    expect(
      screen.getByRole('columnheader', { name: 'Email' }),
    ).toBeInTheDocument();
    expect(bodyRows()).toHaveLength(5);
    expect(screen.getByText('user01@example.com')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Page 2' }));

    expect(screen.getByText('user06@example.com')).toBeInTheDocument();
  });

  it('sorts a column through its header', async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} data={payments} pageSize={5} />);

    const emailHeader = screen.getByRole('columnheader', { name: 'Email' });
    expect(emailHeader).toHaveAttribute('aria-sort', 'none');

    await user.click(within(emailHeader).getByRole('button'));

    expect(emailHeader).toHaveAttribute('aria-sort', 'ascending');
  });

  it('filters by the configured column', async () => {
    const user = userEvent.setup();
    render(
      <DataTable
        columns={columns}
        data={payments}
        filterColumn="email"
        pageSize={5}
      />,
    );

    await user.type(screen.getByRole('textbox', { name: 'Filter…' }), 'user03');

    expect(bodyRows()).toHaveLength(1);
    expect(screen.getByText('user03@example.com')).toBeInTheDocument();
  });

  it('selects rows when enabled', async () => {
    const user = userEvent.setup();
    render(
      <DataTable
        columns={columns}
        data={payments}
        enableRowSelection
        pageSize={5}
      />,
    );

    const rowCheckboxes = screen.getAllByRole('checkbox', {
      name: 'Select row',
    });
    await user.click(rowCheckboxes[0]);

    expect(screen.getByText('1 of 12 row(s) selected.')).toBeInTheDocument();
    expect(bodyRows()[0]).toHaveAttribute('data-state', 'selected');
  });

  it('toggles column visibility from the view menu', async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} data={payments} />);

    await user.click(screen.getByRole('button', { name: 'View' }));
    await user.click(
      await screen.findByRole('menuitemcheckbox', { name: 'Status' }),
    );

    expect(
      screen.queryByRole('columnheader', { name: 'Status' }),
    ).not.toBeInTheDocument();
  });

  it('renders the empty state', () => {
    render(<DataTable columns={columns} data={[]} />);

    expect(screen.getByText('No results')).toBeInTheDocument();
  });

  it('hides pagination when requested', () => {
    render(
      <DataTable
        columns={columns}
        data={payments}
        enablePagination={false}
        pageSize={5}
      />,
    );

    expect(
      screen.queryByRole('navigation', { name: 'Pagination' }),
    ).not.toBeInTheDocument();
  });
});
