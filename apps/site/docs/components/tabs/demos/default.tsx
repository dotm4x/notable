'use client';

import { Tabs } from '@dotm4x/one/components';

export default function Default() {
  return (
    <Tabs defaultValue="overview" style={{ width: '100%', maxWidth: 480 }}>
      <Tabs.List aria-label="Account settings">
        <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
        <Tabs.Trigger value="billing">Billing</Tabs.Trigger>
        <Tabs.Trigger value="members">Members</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="overview">
        <p>Manage your profile details and contact preferences.</p>
      </Tabs.Content>
      <Tabs.Content value="billing">
        <p>Review invoices and update the payment method on file.</p>
      </Tabs.Content>
      <Tabs.Content value="members">
        <p>Invite teammates and choose the role each of them receives.</p>
      </Tabs.Content>
    </Tabs>
  );
}
