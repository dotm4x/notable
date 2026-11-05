'use client';

import { Button, Input, Popover } from '@dotm4x/one/components';

export default function Close() {
  return (
    <Popover>
      <Popover.Trigger>
        <Button variant="outline">Rename project</Button>
      </Popover.Trigger>
      <Popover.Content>
        <Popover.Header>
          <Popover.Title>Rename project</Popover.Title>
          <Popover.Description>
            The new name appears everywhere the project is listed.
          </Popover.Description>
        </Popover.Header>
        <Input label="Project name" defaultValue="Acme Studio" />
        <Popover.Close>Save name</Popover.Close>
      </Popover.Content>
    </Popover>
  );
}
