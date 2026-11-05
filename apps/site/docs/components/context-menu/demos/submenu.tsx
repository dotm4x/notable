'use client';

import { ContextMenu } from '@dotm4x/one/components';
import { Archive, Copy, Share } from '@dotm4x/one/icons';

export default function Submenu() {
  return (
    <ContextMenu>
      <ContextMenu.Trigger>
        <p>Right click this document to share or export it.</p>
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item>
          <Copy size={16} aria-hidden="true" />
          Copy link
        </ContextMenu.Item>
        <ContextMenu.Submenu>
          <ContextMenu.SubmenuTrigger>
            <Share size={16} aria-hidden="true" />
            Share
          </ContextMenu.SubmenuTrigger>
          <ContextMenu.Content>
            <ContextMenu.Item>Copy link</ContextMenu.Item>
            <ContextMenu.Item>Invite by email</ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu.Submenu>
        <ContextMenu.Separator />
        <ContextMenu.Item>
          <Archive size={16} aria-hidden="true" />
          Archive
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu>
  );
}
