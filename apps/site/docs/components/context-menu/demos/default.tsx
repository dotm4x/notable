'use client';

import { ContextMenu } from '@dotm4x/one/components';

export default function Default() {
  return (
    <ContextMenu>
      <ContextMenu.Trigger>
        <p>Right click this project card to open its menu.</p>
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item>Rename</ContextMenu.Item>
        <ContextMenu.Item>Duplicate</ContextMenu.Item>
        <ContextMenu.Item disabled>Move to trash</ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Item>Archive</ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu>
  );
}
