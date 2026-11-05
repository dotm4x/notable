'use client';

import { Sidebar } from '@dotm4x/one/components';
import { Box, Home, LayoutGrid, Settings } from '@dotm4x/one/icons';

export default function Collapsed() {
  return (
    <div style={{ height: 420, overflow: 'hidden', width: '100%' }}>
      <Sidebar.Root label="Acme workspace" defaultOpen={false}>
        <Sidebar.Header>
          <Sidebar.Brand icon={<Box aria-hidden="true" />}>Acme</Sidebar.Brand>
        </Sidebar.Header>
        <Sidebar.Content>
          <Sidebar.Group>
            <Sidebar.GroupLabel>Workspace</Sidebar.GroupLabel>
            <Sidebar.GroupContent>
              <Sidebar.Menu>
                <Sidebar.MenuItem>
                  <Sidebar.Item
                    href="#overview"
                    icon={<Home aria-hidden="true" />}
                    active
                  >
                    Overview
                  </Sidebar.Item>
                </Sidebar.MenuItem>
                <Sidebar.MenuItem>
                  <Sidebar.Item
                    href="#boards"
                    icon={<LayoutGrid aria-hidden="true" />}
                  >
                    Boards
                  </Sidebar.Item>
                </Sidebar.MenuItem>
              </Sidebar.Menu>
            </Sidebar.GroupContent>
          </Sidebar.Group>
        </Sidebar.Content>
        <Sidebar.Footer>
          <Sidebar.Menu>
            <Sidebar.MenuItem>
              <Sidebar.Item
                href="#settings"
                icon={<Settings aria-hidden="true" />}
              >
                Settings
              </Sidebar.Item>
            </Sidebar.MenuItem>
          </Sidebar.Menu>
          <Sidebar.Trigger />
        </Sidebar.Footer>
        <Sidebar.Inset>
          <div style={{ padding: 'var(--one-spacing-6)' }}>
            <Sidebar.Trigger />
            <p style={{ marginBlock: 'var(--one-spacing-4)' }}>
              Use the trigger or press Mod+B to expand the sidebar.
            </p>
          </div>
        </Sidebar.Inset>
      </Sidebar.Root>
    </div>
  );
}
