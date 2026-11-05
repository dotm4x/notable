'use client';

import { Sidebar, type TreeNode } from '@dotm4x/one/components';
import { Box, Download, FileText, Home } from '@dotm4x/one/icons';
import { useMemo } from 'react';
import type { NavItem } from '../../docs/types';

function SectionIcon({ name }: { name?: string }) {
  switch (name) {
    case 'home':
      return <Home aria-hidden="true" />;
    case 'download':
      return <Download aria-hidden="true" />;
    case 'box':
      return <Box aria-hidden="true" />;
    default:
      return <FileText aria-hidden="true" />;
  }
}

function toTreeItem(item: NavItem): TreeNode {
  const icon = <SectionIcon name={item.icon} />;

  if (item.children.length === 0) {
    return {
      id: item.url,
      label: item.title,
      href: item.url,
      icon,
    };
  }

  return {
    id: `section:${item.url}`,
    label: item.title,
    icon,
    children: [
      {
        id: item.url,
        label: 'Overview',
        href: item.url,
      },
      ...item.children.map(toTreeItem),
    ],
  };
}

export interface DocsSidebarProps {
  root: NavItem;
  pathname: string;
}

/** Renders the filesystem-derived navigation tree. */
export function DocsSidebar({ root, pathname }: DocsSidebarProps) {
  const items = useMemo<TreeNode[]>(
    () => [
      {
        id: root.url,
        label: root.title,
        href: root.url,
        icon: <SectionIcon name={root.icon} />,
      },
      ...root.children.map(toTreeItem),
    ],
    [root],
  );

  return (
    <Sidebar.Group>
      <Sidebar.GroupLabel>Contents</Sidebar.GroupLabel>
      <Sidebar.GroupContent>
        <Sidebar.Tree activeId={pathname} aria-label="Contents" items={items} />
      </Sidebar.GroupContent>
    </Sidebar.Group>
  );
}
