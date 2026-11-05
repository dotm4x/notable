'use client';

import { NavigationMenu } from '@dotm4x/one/components';

export default function Dropdown() {
  return (
    <NavigationMenu aria-label="Main">
      <NavigationMenu.List>
        <NavigationMenu.Item value="products">
          <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <NavigationMenu.Link href="/editor" closeOnClick>
              Editor
            </NavigationMenu.Link>
            <NavigationMenu.Link href="/sync" closeOnClick>
              Sync
            </NavigationMenu.Link>
            <NavigationMenu.Link href="/export" closeOnClick>
              Export
            </NavigationMenu.Link>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        <NavigationMenu.Item value="resources">
          <NavigationMenu.Trigger>Resources</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <NavigationMenu.Link href="/docs" closeOnClick>
              Documentation
            </NavigationMenu.Link>
            <NavigationMenu.Link href="/changelog" closeOnClick>
              Changelog
            </NavigationMenu.Link>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link href="/pricing">Pricing</NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu>
  );
}
