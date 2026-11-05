'use client';

import { Table } from '@dotm4x/one/components';

const payments = [
  { email: 'ken99@example.com', amount: '$316.00', status: 'Success' },
  { email: 'Abe45@example.com', amount: '$242.00', status: 'Success' },
  { email: 'Monserrat44@example.com', amount: '$837.00', status: 'Processing' },
];

export default function Sortable() {
  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.Head sort="ascending">Email</Table.Head>
          <Table.Head align="end">Amount</Table.Head>
          <Table.Head sort="descending">Status</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {payments.map((payment) => (
          <Table.Row key={payment.email}>
            <Table.Cell>{payment.email}</Table.Cell>
            <Table.Cell align="end">{payment.amount}</Table.Cell>
            <Table.Cell>{payment.status}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
