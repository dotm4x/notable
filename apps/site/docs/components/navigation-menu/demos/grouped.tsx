'use client';

import { NavigationMenu } from '@dotm4x/one/components';

export default function Grouped() {
  return (
    <NavigationMenu aria-label="Main">
      <NavigationMenu.List>
        <NavigationMenu.Item value="workspaces">
          <NavigationMenu.Trigger>Workspaces</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <div
              style={{
                display: 'grid',
                gap: 'var(--one-spacing-4)',
                gridTemplateColumns: 'repeat(2, minmax(10rem, 1fr))',
                padding: 'var(--one-spacing-3)',
              }}
            >
              <NavigationMenu.Group aria-label="Personal">
                <NavigationMenu.Link href="/work/personal" closeOnClick>
                  Personal
                </NavigationMenu.Link>
                <NavigationMenu.Link href="/work/archive" closeOnClick>
                  Archive
                </NavigationMenu.Link>
              </NavigationMenu.Group>
              <NavigationMenu.Group aria-label="Shared">
                <NavigationMenu.Link href="/work/team" closeOnClick>
                  Team
                </NavigationMenu.Link>
                <NavigationMenu.Link href="/work/shared" closeOnClick>
                  Shared with me
                </NavigationMenu.Link>
              </NavigationMenu.Group>
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link href="/pricing">Pricing</NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu>
  );
}
