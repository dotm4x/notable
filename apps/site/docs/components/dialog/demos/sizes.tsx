'use client';

import { Button, Dialog } from '@dotm4x/one/components';

const sizes = [
  { size: 'small', label: 'Small dialog' },
  { size: 'medium', label: 'Medium dialog' },
  { size: 'large', label: 'Large dialog' },
] as const;

export default function Sizes() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
      {sizes.map(({ size, label }) => (
        <Dialog key={size}>
          <Dialog.Trigger>
            <Button variant="outline">{label}</Button>
          </Dialog.Trigger>
          <Dialog.Content size={size}>
            <Dialog.Header>
              <Dialog.Title>{label}</Dialog.Title>
              <Dialog.Description>
                This dialog uses the {size} width.
              </Dialog.Description>
            </Dialog.Header>
            <Dialog.Footer>
              <Dialog.Close>Close</Dialog.Close>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog>
      ))}
    </div>
  );
}
