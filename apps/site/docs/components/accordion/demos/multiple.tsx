'use client';

import { Accordion } from '@dotm4x/one/components';

export default function Multiple() {
  return (
    <Accordion type="multiple" defaultValue={['notifications']}>
      <Accordion.Item value="notifications" title="Notifications">
        Choose how and when you receive updates about your workspace.
      </Accordion.Item>
      <Accordion.Item value="security" title="Security">
        Review active sessions and enable two-factor authentication.
      </Accordion.Item>
      <Accordion.Item value="billing" title="Billing">
        Update your payment method and download past invoices.
      </Accordion.Item>
    </Accordion>
  );
}
