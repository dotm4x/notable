'use client';

import { Empty } from '@dotm4x/one/components';
import { FolderOpen } from '@dotm4x/one/icons';

export default function Default() {
  return (
    <Empty>
      <Empty.Header>
        <Empty.Media variant="icon">
          <FolderOpen aria-hidden="true" />
        </Empty.Media>
        <Empty.Title>No projects yet</Empty.Title>
        <Empty.Description>
          Create your first project to see it appear here.
        </Empty.Description>
      </Empty.Header>
    </Empty>
  );
}
