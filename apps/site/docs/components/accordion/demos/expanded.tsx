'use client';

import { Accordion } from '@dotm4x/one/components';

export default function Expanded() {
  return (
    <Accordion type="single" defaultValue="returns">
      <Accordion.Item value="shipping" title="Shipping">
        Orders ship within two business days.
      </Accordion.Item>
      <Accordion.Item value="returns" title="Returns">
        Returns are accepted for thirty days after delivery.
      </Accordion.Item>
    </Accordion>
  );
}
