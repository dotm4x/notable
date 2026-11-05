'use client';

import { Button, Dialog } from '@dotm4x/one/components';

export default function Default() {
  return (
    <Dialog>
      <Dialog.Trigger>
        <Button>Share project</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Share project</Dialog.Title>
          <Dialog.Description>
            Anyone with the link can view this project. You can revoke access at
            any time.
          </Dialog.Description>
        </Dialog.Header>
        <Dialog.Footer>
          <Dialog.Close>Done</Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
}
