'use client';

import { Card } from '@dotm4x/one/components';

export default function Flush() {
  return (
    <Card padding="none" style={{ width: 360 }}>
      <Card.Header style={{ padding: 'var(--one-spacing-6)' }}>
        <Card.Title>Recent activity</Card.Title>
        <Card.Description>
          Content below sits flush with the edge.
        </Card.Description>
      </Card.Header>
      <Card.Content>
        <div
          style={{
            height: 120,
            overflow: 'auto',
            padding:
              '0 var(--one-spacing-6) var(--one-spacing-6) var(--one-spacing-6)',
          }}
        >
          Pull requests, reviews, and deployments from the last seven days.
        </div>
      </Card.Content>
    </Card>
  );
}
