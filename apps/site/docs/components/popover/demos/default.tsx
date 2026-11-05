'use client';

import { Button, Popover } from '@dotm4x/one/components';

export default function Default() {
  return (
    <Popover>
      <Popover.Trigger>
        <Button>Open filters</Button>
      </Popover.Trigger>
      <Popover.Content>
        <Popover.Header>
          <Popover.Title>Filters</Popover.Title>
          <Popover.Description>
            Choose which projects appear in this list.
          </Popover.Description>
        </Popover.Header>
      </Popover.Content>
    </Popover>
  );
}
