'use client';

import { Button, Tooltip } from '@dotm4x/one/components';

export default function Default() {
  return (
    <Tooltip content="Copy the link to this page">
      <Button variant="outline">Copy link</Button>
    </Tooltip>
  );
}
