'use client';

import { Button, DropdownMenu } from '@dotm4x/one/components';

export default function Selection() {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger>
        <Button variant="outline">View</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Group>
          <DropdownMenu.GroupLabel>Show</DropdownMenu.GroupLabel>
          <DropdownMenu.CheckboxItem defaultChecked>
            Sidebar
          </DropdownMenu.CheckboxItem>
          <DropdownMenu.CheckboxItem>Status bar</DropdownMenu.CheckboxItem>
          <DropdownMenu.CheckboxItem disabled>
            Developer tools
          </DropdownMenu.CheckboxItem>
        </DropdownMenu.Group>
        <DropdownMenu.Separator />
        <DropdownMenu.Group>
          <DropdownMenu.GroupLabel>Sort by</DropdownMenu.GroupLabel>
          <DropdownMenu.RadioGroup defaultValue="modified">
            <DropdownMenu.RadioItem value="name">Name</DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="modified">
              Last modified
            </DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="created">
              Date created
            </DropdownMenu.RadioItem>
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}
