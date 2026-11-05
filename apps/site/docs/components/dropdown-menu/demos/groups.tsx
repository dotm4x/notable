'use client';

import { Button, DropdownMenu, Shortcut } from '@dotm4x/one/components';

export default function Groups() {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger>
        <Button variant="outline">File</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Group>
          <DropdownMenu.GroupLabel>Document</DropdownMenu.GroupLabel>
          <DropdownMenu.Item>
            New note
            <Shortcut>Ctrl</Shortcut>
            <Shortcut>N</Shortcut>
          </DropdownMenu.Item>
          <DropdownMenu.Item>
            Duplicate
            <Shortcut>Ctrl</Shortcut>
            <Shortcut>D</Shortcut>
          </DropdownMenu.Item>
        </DropdownMenu.Group>
        <DropdownMenu.Separator />
        <DropdownMenu.Group>
          <DropdownMenu.GroupLabel>Danger zone</DropdownMenu.GroupLabel>
          <DropdownMenu.Item disabled>Delete permanently</DropdownMenu.Item>
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}
