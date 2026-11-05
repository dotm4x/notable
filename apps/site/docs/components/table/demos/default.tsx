'use client';

import { Table } from '@dotm4x/one/components';

const payments = [
  { email: 'ken99@example.com', amount: '$316.00', status: 'Success' },
  { email: 'Abe45@example.com', amount: '$242.00', status: 'Success' },
  { email: 'Monserrat44@example.com', amount: '$837.00', status: 'Processing' },
  { email: 'Silas22@example.com', amount: '$874.00', status: 'Success' },
];

export default function Default() {
  return (
    <Table>
      <Table.Caption>Recent payments</Table.Caption>
      <Table.Header>
        <Table.Row>
          <Table.Head>Email</Table.Head>
          <Table.Head align="end">Amount</Table.Head>
          <Table.Head>Status</Table.Head>
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
