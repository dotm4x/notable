'use client';

import { Button, Empty } from '@dotm4x/one/components';
import { Inbox, Upload } from '@dotm4x/one/icons';

export default function Action() {
  return (
    <Empty>
      <Empty.Header>
        <Empty.Media variant="icon">
          <Inbox aria-hidden="true" />
        </Empty.Media>
        <Empty.Title>Your inbox is empty</Empty.Title>
        <Empty.Description>
          New messages will appear here. You can also import an existing
          archive.
        </Empty.Description>
      </Empty.Header>
      <Empty.Content>
        <Button>Compose message</Button>
        <Button variant="outline">
          <Upload aria-hidden="true" />
          Import archive
        </Button>
      </Empty.Content>
    </Empty>
  );
}
