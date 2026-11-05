'use client';

import { Sidebar, type TreeNode } from '@dotm4x/one/components';
import { Box, Download, FileText, Home, Sparkles } from '@dotm4x/one/icons';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { NavItem } from '../../docs/types';

function SectionIcon({ name }: { name?: string }) {
  switch (name) {
    case 'home':
      return <Home aria-hidden="true" />;
    case 'download':
      return <Download aria-hidden="true" />;
    case 'box':
      return <Box aria-hidden="true" />;
    case 'sparkles':
      return <Sparkles aria-hidden="true" />;
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
        icon: <FileText aria-hidden="true" />,
      },
      ...item.children.map(toTreeItem),
    ],
  };
}

/**
 * Keeps a section active while a nested route, such as an icon detail page,
 * is open.
 */
function resolveActiveId(items: TreeNode[], pathname: string) {
  let activeId = '';

  const visit = (nodes: TreeNode[]) => {
    for (const node of nodes) {
      if (
        node.href &&
        (pathname === node.href || pathname.startsWith(`${node.href}/`)) &&
        node.href.length > activeId.length
      ) {
        activeId = node.href;
      }

      if (node.children) {
        visit(node.children);
      }
    }
  };

  visit(items);
  return activeId || pathname;
}

export interface DocsSidebarProps {
  root: NavItem;
  pathname: string;
}

/** Renders the filesystem-derived navigation tree. */
export function DocsSidebar({ root, pathname }: DocsSidebarProps) {
  const router = useRouter();
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
  const activeId = useMemo(
    () => resolveActiveId(items, pathname),
    [items, pathname],
  );

  return (
    <Sidebar.Group>
      <Sidebar.GroupLabel>Contents</Sidebar.GroupLabel>
      <Sidebar.GroupContent>
        <div
          onClick={(event) => {
            const anchor = (event.target as HTMLElement).closest('a');
            if (!anchor) {
              return;
            }
            const href = anchor.getAttribute('href');
            if (!href || !href.startsWith('/')) {
              return;
            }
            event.preventDefault();
            router.push(href);
          }}
        >
          <Sidebar.Tree
            activeId={activeId}
            aria-label="Contents"
            items={items}
          />
        </div>
      </Sidebar.GroupContent>
    </Sidebar.Group>
  );
}
