'use client';

import { Tabs } from '@dotm4x/one/components';

export default function Vertical() {
  return (
    <Tabs
      defaultValue="profile"
      orientation="vertical"
      style={{ width: '100%', maxWidth: 480 }}
    >
      <Tabs.List aria-label="Workspace settings">
        <Tabs.Trigger value="profile">Profile</Tabs.Trigger>
        <Tabs.Trigger value="notifications">Notifications</Tabs.Trigger>
        <Tabs.Trigger value="security">Security</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="profile">
        <p>Update your display name and profile photo.</p>
      </Tabs.Content>
      <Tabs.Content value="notifications">
        <p>Choose which activity sends you an email digest.</p>
      </Tabs.Content>
      <Tabs.Content value="security">
        <p>Review active sessions and two-factor authentication.</p>
      </Tabs.Content>
    </Tabs>
  );
}
