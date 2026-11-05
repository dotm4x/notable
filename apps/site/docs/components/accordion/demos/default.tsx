'use client';

import { Accordion } from '@dotm4x/one/components';

export default function Default() {
  return (
    <Accordion type="single">
      <Accordion.Item value="shipping" title="Shipping">
        Orders ship within two business days and include tracking details.
      </Accordion.Item>
      <Accordion.Item value="returns" title="Returns">
        Unused items can be returned within thirty days of delivery.
      </Accordion.Item>
      <Accordion.Item value="warranty" title="Warranty">
        Every product is covered against manufacturing defects for one year.
      </Accordion.Item>
    </Accordion>
  );
}
