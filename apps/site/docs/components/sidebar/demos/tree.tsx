'use client';

import { Sidebar } from '@dotm4x/one/components';
import { Box, FileText, Folder, Home } from '@dotm4x/one/icons';

const items = [
  {
    id: 'home',
    label: 'Overview',
    href: '#overview',
    icon: <Home aria-hidden="true" />,
  },
  {
    id: 'guides',
    label: 'Guides',
    icon: <Folder aria-hidden="true" />,
    children: [
      {
        id: 'getting-started',
        label: 'Getting started',
        href: '#getting-started',
      },
      { id: 'theming', label: 'Theming', href: '#theming' },
      { id: 'accessibility', label: 'Accessibility', href: '#accessibility' },
    ],
  },
  {
    id: 'reference',
    label: 'Reference',
    icon: <FileText aria-hidden="true" />,
    children: [
      { id: 'tokens', label: 'Tokens', href: '#tokens' },
      { id: 'components', label: 'Components', href: '#components' },
    ],
  },
];

export default function Tree() {
  return (
    <div style={{ height: 420, overflow: 'hidden', width: '100%' }}>
      <Sidebar.Root label="Documentation">
        <Sidebar.Header>
          <Sidebar.Brand icon={<Box aria-hidden="true" />}>One</Sidebar.Brand>
        </Sidebar.Header>
        <Sidebar.Content>
          <Sidebar.Tree
            aria-label="Documentation contents"
            activeId="theming"
            items={items}
            defaultExpandedIds={['guides']}
          />
        </Sidebar.Content>
        <Sidebar.Footer>
          <Sidebar.Trigger />
        </Sidebar.Footer>
        <Sidebar.Inset>
          <div style={{ padding: 'var(--one-spacing-6)' }}>
            <Sidebar.Trigger />
            <p style={{ marginBlock: 'var(--one-spacing-4)' }}>
              The tree inherits the sidebar's collapsed and mobile state.
            </p>
          </div>
        </Sidebar.Inset>
      </Sidebar.Root>
    </div>
  );
}
