'use client';

import { Card } from '@dotm4x/one/components';

export default function ContentOnly() {
  return (
    <Card style={{ width: 360 }}>
      <Card.Content>
        Two-factor authentication is required for every administrator.
      </Card.Content>
    </Card>
  );
}
