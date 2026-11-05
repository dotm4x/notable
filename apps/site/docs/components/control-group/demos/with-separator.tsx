'use client';

import { Button, ControlGroup } from '@dotm4x/one/components';

export default function WithSeparator() {
  return (
    <ControlGroup aria-label="Document actions">
      <Button variant="outline">Save</Button>
      <ControlGroup.Separator />
      <Button variant="outline">Share</Button>
      <ControlGroup.Separator />
      <Button variant="outline">Archive</Button>
    </ControlGroup>
  );
}
