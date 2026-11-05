'use client';

import { Button, Popover } from '@dotm4x/one/components';

export default function Placement() {
  return (
    <Popover>
      <Popover.Trigger>
        <Button variant="secondary">Anchored above</Button>
      </Popover.Trigger>
      <Popover.Content side="top" align="start">
        <Popover.Header>
          <Popover.Title>Keyboard shortcuts</Popover.Title>
          <Popover.Description>
            Press Escape to close this popover.
          </Popover.Description>
        </Popover.Header>
      </Popover.Content>
    </Popover>
  );
}
