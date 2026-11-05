'use client';

import { Tree, type TreeNode } from '@dotm4x/one/components';
import { Box, Download, FileText, Home } from '@dotm4x/one/icons';

const items: TreeNode[] = [
  {
    id: 'intro',
    label: 'Introduction',
    href: '#introduction',
    icon: <Home aria-hidden="true" />,
  },
  {
    id: 'installation',
    label: 'Installation',
    href: '#installation',
    icon: <Download aria-hidden="true" />,
  },
  {
    id: 'components',
    label: 'Components',
    icon: <Box aria-hidden="true" />,
    children: [
      { id: 'overview', label: 'Overview', href: '#components' },
      {
        id: 'button',
        label: 'Button',
        href: '#button',
        icon: <FileText aria-hidden="true" />,
      },
      {
        id: 'dialog',
        label: 'Dialog',
        href: '#dialog',
        icon: <FileText aria-hidden="true" />,
      },
    ],
  },
];

export default function Default() {
  return (
    <Tree
      aria-label="Documentation"
      defaultExpandedIds={['components']}
      items={items}
    />
  );
}
