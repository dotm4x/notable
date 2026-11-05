import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { DocsShell } from '../../source/components/docs';
import { getNavTree } from '../../source/docs/content';
import '../../source/styles/docs.css';

export const metadata: Metadata = {
  title: {
    default: 'Documentation',
    template: '%s — One',
  },
  description: 'Design language, components, and usage guidance for One.',
};

export default function DocsLayout({ children }: { children: ReactNode }) {
  const tree = getNavTree();

  return <DocsShell tree={tree}>{children}</DocsShell>;
}
