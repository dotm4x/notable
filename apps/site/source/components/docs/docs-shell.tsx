'use client';

import { Sidebar } from '@dotm4x/one/components';
import { SiGithub } from '@icons-pack/react-simple-icons';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import type { NavItem } from '../../docs/types';
import { DocsHeader } from './docs-header';
import { DocsSidebar } from './docs-sidebar';

export interface DocsShellProps {
  tree: NavItem;
  children: ReactNode;
}

/** Composes the sidebar, header, and page content into the docs layout. */
export function DocsShell({ tree, children }: DocsShellProps) {
  const pathname = usePathname();

  return (
    <Sidebar.Root
      className="docs-shell"
      collapsedWidth="3.5rem"
      label="Documentation"
      width="17rem"
    >
      <Sidebar.Content>
        <DocsSidebar pathname={pathname} root={tree} />
      </Sidebar.Content>
      <Sidebar.Footer>
        <Sidebar.Menu>
          <Sidebar.MenuItem>
            <Sidebar.Item
              href="https://github.com/dotm4x/one"
              icon={<SiGithub size={16} />}
              rel="noreferrer"
              target="_blank"
            >
              GitHub
            </Sidebar.Item>
          </Sidebar.MenuItem>
        </Sidebar.Menu>
      </Sidebar.Footer>
      <Sidebar.Inset className="docs-inset">
        <DocsHeader />
        {children}
      </Sidebar.Inset>
    </Sidebar.Root>
  );
}
