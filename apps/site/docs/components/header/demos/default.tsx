'use client';

import { Button, Header } from '@dotm4x/one/components';

export default function Default() {
  return (
    <div style={{ inlineSize: '100%' }}>
      <Header>
        <strong>Acme Studio</strong>
        <Button variant="secondary">Sign in</Button>
      </Header>
    </div>
  );
}
