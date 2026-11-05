'use client';

import { Table } from '@dotm4x/one/components';

const payments = [
  { email: 'ken99@example.com', amount: '$316.00' },
  { email: 'Abe45@example.com', amount: '$242.00' },
  { email: 'Monserrat44@example.com', amount: '$837.00' },
];

export default function Selected() {
  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.Head>Email</Table.Head>
          <Table.Head align="end">Amount</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {payments.map((payment, index) => (
          <Table.Row key={payment.email} selected={index === 1}>
            <Table.Cell>{payment.email}</Table.Cell>
            <Table.Cell align="end">{payment.amount}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
