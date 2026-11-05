'use client';

import { Sidebar } from '@dotm4x/one/components';
import {
  Activity,
  Bell,
  Box,
  CircleHelp,
  Folder,
  Home,
  Settings,
  SquarePen,
} from '@dotm4x/one/icons';

export default function Default() {
  return (
    <div style={{ height: 420, overflow: 'hidden', width: '100%' }}>
      <Sidebar.Root label="Acme workspace">
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
                    href="#activity"
                    icon={<Activity aria-hidden="true" />}
                  >
                    Activity
                  </Sidebar.Item>
                  <Sidebar.MenuBadge>
                    <span aria-hidden="true">3</span>
                    <span className="one-sidebar__sr-only">
                      3 unread updates
                    </span>
                  </Sidebar.MenuBadge>
                </Sidebar.MenuItem>
                <Sidebar.MenuItem>
                  <Sidebar.Item
                    href="#notifications"
                    icon={<Bell aria-hidden="true" />}
                  >
                    Notifications
                  </Sidebar.Item>
                </Sidebar.MenuItem>
              </Sidebar.Menu>
            </Sidebar.GroupContent>
          </Sidebar.Group>
          <Sidebar.Group>
            <Sidebar.GroupLabel>Projects</Sidebar.GroupLabel>
            <Sidebar.GroupAction aria-label="Create project">
              <SquarePen aria-hidden="true" />
            </Sidebar.GroupAction>
            <Sidebar.GroupContent>
              <Sidebar.Menu>
                <Sidebar.MenuItem>
                  <Sidebar.Submenu
                    label="Design system"
                    icon={<Folder aria-hidden="true" />}
                  >
                    <Sidebar.SubmenuItem href="#foundations">
                      Foundations
                    </Sidebar.SubmenuItem>
                    <Sidebar.SubmenuItem href="#components">
                      Components
                    </Sidebar.SubmenuItem>
                  </Sidebar.Submenu>
                </Sidebar.MenuItem>
              </Sidebar.Menu>
            </Sidebar.GroupContent>
          </Sidebar.Group>
        </Sidebar.Content>
        <Sidebar.Footer>
          <Sidebar.Menu>
            <Sidebar.MenuItem>
              <Sidebar.Item
                href="#help"
                icon={<CircleHelp aria-hidden="true" />}
              >
                Help and support
              </Sidebar.Item>
            </Sidebar.MenuItem>
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
            <h2 style={{ marginBlock: 'var(--one-spacing-4)' }}>Overview</h2>
            <p style={{ margin: 0 }}>Your workspace, at a glance.</p>
          </div>
        </Sidebar.Inset>
      </Sidebar.Root>
    </div>
  );
}
