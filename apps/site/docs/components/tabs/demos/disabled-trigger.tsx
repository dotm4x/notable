'use client';

import { Tabs } from '@dotm4x/one/components';

export default function DisabledTrigger() {
  return (
    <Tabs defaultValue="preview" style={{ width: '100%', maxWidth: 480 }}>
      <Tabs.List aria-label="Component example">
        <Tabs.Trigger value="preview">Preview</Tabs.Trigger>
        <Tabs.Trigger value="code">Code</Tabs.Trigger>
        <Tabs.Trigger value="api" disabled>
          API
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="preview">
        <p>The rendered component appears in this panel.</p>
      </Tabs.Content>
      <Tabs.Content value="code">
        <p>The source used to build the example appears in this panel.</p>
      </Tabs.Content>
    </Tabs>
  );
}
