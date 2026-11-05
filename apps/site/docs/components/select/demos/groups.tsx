'use client';

import { Select } from '@dotm4x/one/components';

export default function Groups() {
  return (
    <div style={{ width: '18rem' }}>
      <Select>
        <Select.Label>Workspace role</Select.Label>
        <Select.Trigger>
          <Select.Value placeholder="Choose a role" />
          <Select.Icon />
        </Select.Trigger>
        <Select.Content>
          <Select.List>
            <Select.Group>
              <Select.GroupLabel>Individual</Select.GroupLabel>
              <Select.Item value="viewer">Viewer</Select.Item>
              <Select.Item value="editor">Editor</Select.Item>
            </Select.Group>
            <Select.Separator />
            <Select.Group>
              <Select.GroupLabel>Organization</Select.GroupLabel>
              <Select.Item value="admin">Administrator</Select.Item>
              <Select.Item value="owner">Owner</Select.Item>
            </Select.Group>
          </Select.List>
        </Select.Content>
      </Select>
    </div>
  );
}
