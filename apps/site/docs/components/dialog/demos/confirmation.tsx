'use client';

import { Button, Dialog } from '@dotm4x/one/components';

export default function Confirmation() {
  return (
    <Dialog>
      <Dialog.Trigger>
        <Button variant="danger">Delete project</Button>
      </Dialog.Trigger>
      <Dialog.Content size="small">
        <Dialog.Header>
          <Dialog.Title>Delete project?</Dialog.Title>
          <Dialog.Description>
            This action cannot be undone. All files in the project will be
            removed.
          </Dialog.Description>
        </Dialog.Header>
        <Dialog.Footer>
          <Dialog.Close>Cancel</Dialog.Close>
          <Dialog.Close variant="danger">Delete project</Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
}
