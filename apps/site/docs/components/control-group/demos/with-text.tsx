'use client';

import { Button, ControlGroup, Input } from '@dotm4x/one/components';

export default function WithText() {
  return (
    <ControlGroup aria-label="Search notes">
      <ControlGroup.Text render={<label htmlFor="control-group-query" />}>
        Find
      </ControlGroup.Text>
      <Input id="control-group-query" placeholder="Search notes" />
      <Button variant="outline">Search</Button>
    </ControlGroup>
  );
}
