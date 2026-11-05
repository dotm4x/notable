'use client';

import { Button, Card } from '@dotm4x/one/components';

export default function Default() {
  return (
    <Card style={{ width: 360 }}>
      <Card.Header>
        <Card.Title>Project settings</Card.Title>
        <Card.Description>
          Manage how this project is shared and built.
        </Card.Description>
      </Card.Header>
      <Card.Content>
        Visibility is set to private for all collaborators.
      </Card.Content>
      <Card.Footer>
        <Button variant="secondary" size="small">
          Cancel
        </Button>
        <Button size="small">Save</Button>
      </Card.Footer>
    </Card>
  );
}
