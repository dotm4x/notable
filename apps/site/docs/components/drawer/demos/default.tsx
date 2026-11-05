'use client';

import { Button, Drawer } from '@dotm4x/one/components';

export default function Default() {
  return (
    <Drawer>
      <Drawer.Trigger>
        <Button>Open drawer</Button>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>Share project</Drawer.Title>
          <Drawer.Description>
            Anyone with the link can view this project. You can revoke access at
            any time.
          </Drawer.Description>
        </Drawer.Header>
        <Drawer.Footer>
          <Drawer.Close>Done</Drawer.Close>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  );
}
