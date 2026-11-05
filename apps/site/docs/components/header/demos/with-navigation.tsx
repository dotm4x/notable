'use client';

import { Button, Header, NavigationMenu } from '@dotm4x/one/components';

export default function WithNavigation() {
  return (
    <div style={{ inlineSize: '100%' }}>
      <Header mode="fixed">
        <strong>Acme Studio</strong>
        <NavigationMenu aria-label="Main">
          <NavigationMenu.List>
            <NavigationMenu.Item value="product">
              <NavigationMenu.Trigger>Product</NavigationMenu.Trigger>
              <NavigationMenu.Content>
                <NavigationMenu.Link href="#editor" closeOnClick>
                  Editor
                </NavigationMenu.Link>
                <NavigationMenu.Link href="#sync" closeOnClick>
                  Sync
                </NavigationMenu.Link>
              </NavigationMenu.Content>
            </NavigationMenu.Item>
            <NavigationMenu.Item>
              <NavigationMenu.Link href="#pricing">Pricing</NavigationMenu.Link>
            </NavigationMenu.Item>
          </NavigationMenu.List>
        </NavigationMenu>
        <Button variant="secondary">Sign in</Button>
      </Header>
    </div>
  );
}
