'use client';

import { Button, DropdownMenu } from '@dotm4x/one/components';

export default function Submenu() {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger>
        <Button variant="outline">Note</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item>Rename</DropdownMenu.Item>
        <DropdownMenu.Item>Duplicate</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Submenu>
          <DropdownMenu.SubmenuTrigger>Move to</DropdownMenu.SubmenuTrigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>Inbox</DropdownMenu.Item>
            <DropdownMenu.Item>Projects</DropdownMenu.Item>
            <DropdownMenu.Item>Archive</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Submenu>
        <DropdownMenu.Submenu>
          <DropdownMenu.SubmenuTrigger>Export</DropdownMenu.SubmenuTrigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>Markdown</DropdownMenu.Item>
            <DropdownMenu.Item>PDF</DropdownMenu.Item>
            <DropdownMenu.Item disabled>Word (unavailable)</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Submenu>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}
