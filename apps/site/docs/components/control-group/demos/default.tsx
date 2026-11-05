'use client';

import { Button, ControlGroup } from '@dotm4x/one/components';

export default function Default() {
  return (
    <ControlGroup aria-label="Text formatting">
      <Button variant="outline">Bold</Button>
      <Button variant="outline">Italic</Button>
      <Button variant="outline">Underline</Button>
    </ControlGroup>
  );
}
