'use client';

import { Button, ControlGroup } from '@dotm4x/one/components';

export default function Vertical() {
  return (
    <ControlGroup orientation="vertical" aria-label="Document actions">
      <Button variant="outline">Move up</Button>
      <Button variant="outline">Move down</Button>
      <Button variant="outline">Delete</Button>
    </ControlGroup>
  );
}
