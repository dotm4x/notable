'use client';

import { Accordion } from '@dotm4x/one/components';

export default function Disabled() {
  return (
    <Accordion type="multiple">
      <Accordion.Item value="available" title="Available">
        This section can be opened and closed.
      </Accordion.Item>
      <Accordion.Item value="coming-soon" title="Coming soon" disabled>
        This content is not available yet.
      </Accordion.Item>
      <Accordion.Item value="archived" title="Archived" disabled>
        Archived content cannot be expanded.
      </Accordion.Item>
    </Accordion>
  );
}
