'use client';

import { ContextMenu } from '@dotm4x/one/components';

export default function CheckboxRadio() {
  return (
    <ContextMenu>
      <ContextMenu.Trigger>
        <p>Right click the editor to change its display options.</p>
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Group>
          <ContextMenu.GroupLabel>View</ContextMenu.GroupLabel>
          <ContextMenu.CheckboxItem defaultChecked>
            Show line numbers
          </ContextMenu.CheckboxItem>
          <ContextMenu.CheckboxItem>Wrap long lines</ContextMenu.CheckboxItem>
        </ContextMenu.Group>
        <ContextMenu.Separator />
        <ContextMenu.Group>
          <ContextMenu.GroupLabel>Density</ContextMenu.GroupLabel>
          <ContextMenu.RadioGroup defaultValue="comfortable">
            <ContextMenu.RadioItem value="compact">
              Compact
            </ContextMenu.RadioItem>
            <ContextMenu.RadioItem value="comfortable">
              Comfortable
            </ContextMenu.RadioItem>
          </ContextMenu.RadioGroup>
        </ContextMenu.Group>
      </ContextMenu.Content>
    </ContextMenu>
  );
}
