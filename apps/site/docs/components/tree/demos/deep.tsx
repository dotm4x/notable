'use client';

import { Tree, type TreeNode } from '@dotm4x/one/components';
import { FileText, Folder } from '@dotm4x/one/icons';

const items: TreeNode[] = [
  {
    id: 'src',
    label: 'src',
    icon: <Folder aria-hidden="true" />,
    children: [
      {
        id: 'components',
        label: 'components',
        icon: <Folder aria-hidden="true" />,
        children: [
          {
            id: 'table',
            label: 'table.tsx',
            href: '#table',
            icon: <FileText aria-hidden="true" />,
          },
          {
            id: 'data-table',
            label: 'data-table.tsx',
            href: '#data-table',
            icon: <FileText aria-hidden="true" />,
          },
        ],
      },
      {
        id: 'button',
        label: 'button.tsx',
        href: '#button',
        icon: <FileText aria-hidden="true" />,
      },
    ],
  },
  {
    id: 'package',
    label: 'package.json',
    href: '#package',
    icon: <FileText aria-hidden="true" />,
  },
];

export default function Deep() {
  return (
    <Tree
      aria-label="Project files"
      defaultExpandedIds={['src', 'components']}
      items={items}
    />
  );
}
