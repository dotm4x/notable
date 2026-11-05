'use client';

import { Button, Header, Sidebar } from '@dotm4x/one/components';
import Link from 'next/link';
import { SiGithub } from '@icons-pack/react-simple-icons';
import { Logo } from '../logo';
import { ThemeToggle } from '../theme-toggle';

/** Sticky header for documentation pages. */
export function DocsHeader() {
  return (
    <Header className="docs-header" mode="fixed">
      <div className="docs-header__group">
        <Sidebar.Trigger />
        <Link className="docs-header__brand" href="/docs" aria-label="One">
          <Logo className="docs-header__logo" />
        </Link>
      </div>
      <nav aria-label="Docs navigation" className="docs-header__nav">
        <Link href="/docs">Docs</Link>
        <Link href="/docs/components">Components</Link>
        <Link href="/docs/icons">Icons</Link>
      </nav>
      <div className="docs-header__actions">
        <Button asChild size="icon" variant="ghost">
          <a
            aria-label="One on GitHub"
            href="https://github.com/dotm4x/one"
            rel="noreferrer"
            target="_blank"
          >
            <SiGithub size={18} />
          </a>
        </Button>
        <ThemeToggle />
      </div>
    </Header>
  );
}
