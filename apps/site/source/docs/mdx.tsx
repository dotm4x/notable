import 'server-only';

import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
  type TableHTMLAttributes,
} from 'react';
import {
  DocsCallout,
  DocsCodeBlock,
  DocsIconGallery,
  DocsPageList,
} from '../components/docs';
import type { MDXComponents } from 'mdx/types';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

import { Demo, type DemoProps } from './demo';
import { PackageManagerTabs } from './package-manager-tabs';
import type { DocPage, NavItem } from './types';

function Table({ children, ...props }: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="docs-table">
      <table {...props}>{children}</table>
    </div>
  );
}

function FencedCode({ children }: { children?: ReactNode }) {
  const child = Children.toArray(children)[0];

  if (!isValidElement(child)) {
    return <pre>{children}</pre>;
  }

  const codeElement = child as ReactElement<{
    className?: string;
    children?: ReactNode;
  }>;
  const className = codeElement.props.className ?? '';
  const language = /language-([\w-]+)/.exec(className)?.[1] ?? 'text';
  const code = String(codeElement.props.children ?? '');

  return <DocsCodeBlock code={code} language={language} />;
}

function createComponents(
  doc: DocPage,
  navNode: NavItem | undefined,
): MDXComponents {
  function DemoForPage(props: Omit<DemoProps, 'demoBase'>) {
    return <Demo {...props} demoBase={doc.demoBase} />;
  }

  function PageListForPage() {
    return <DocsPageList items={navNode?.children ?? []} />;
  }

  return {
    Callout: DocsCallout,
    Demo: DemoForPage,
    IconGallery: DocsIconGallery,
    PackageManagerTabs,
    PageList: PageListForPage,
    pre: FencedCode,
    table: Table,
  };
}

export interface DocContentProps {
  doc: DocPage;
  navNode?: NavItem;
}

/** Compiles and renders the page MDX with the documentation primitives. */
export async function DocContent({ doc, navNode }: DocContentProps) {
  return (
    <MDXRemote
      components={createComponents(doc, navNode)}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [rehypeSlug],
        },
      }}
      source={doc.content}
    />
  );
}
