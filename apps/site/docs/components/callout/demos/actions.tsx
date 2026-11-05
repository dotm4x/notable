'use client';

import { Button, Callout } from '@dotm4x/one/components';
import { TriangleAlert } from '@dotm4x/one/icons';

export default function WithActions() {
  return (
    <Callout tone="warning">
      <Callout.Icon>
        <TriangleAlert aria-hidden="true" />
      </Callout.Icon>
      <Callout.Content>
        <Callout.Title>Unsaved changes</Callout.Title>
        <p>Save your changes before leaving this page.</p>
      </Callout.Content>
      <Callout.Actions>
        <Button size="small" variant="secondary">
          Discard
        </Button>
        <Button size="small">Save</Button>
      </Callout.Actions>
    </Callout>
  );
}
