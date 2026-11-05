'use client';

import { Button, Drawer } from '@dotm4x/one/components';

const sides = [
  { side: 'right', label: 'Right drawer' },
  { side: 'left', label: 'Left drawer' },
  { side: 'top', label: 'Top drawer' },
  { side: 'bottom', label: 'Bottom drawer' },
] as const;

export default function Sides() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
      {sides.map(({ side, label }) => (
        <Drawer key={side} side={side}>
          <Drawer.Trigger>
            <Button variant="outline">{label}</Button>
          </Drawer.Trigger>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>{label}</Drawer.Title>
              <Drawer.Description>
                This drawer slides in from the {side} edge of the viewport.
              </Drawer.Description>
            </Drawer.Header>
            <Drawer.Footer>
              <Drawer.Close>Close</Drawer.Close>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer>
      ))}
    </div>
  );
}
