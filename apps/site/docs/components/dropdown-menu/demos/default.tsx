'use client';

import { Button, DropdownMenu } from '@dotm4x/one/components';

export default function Default() {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger>
        <Button variant="secondary">Actions</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item>Rename</DropdownMenu.Item>
        <DropdownMenu.Item>Duplicate</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item>Archive</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}
