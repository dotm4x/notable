'use client';

import { Button, Header, Sidebar } from '@dotm4x/one/components';
import { SiGithub } from '@icons-pack/react-simple-icons';
import { ThemeToggle } from '../theme-toggle';

/** Sticky header for documentation pages. */
export function DocsHeader() {
  return (
    <Header className="docs-header" mode="fixed">
      <div className="docs-header__group">
        <Sidebar.Trigger />
        <a className="docs-header__brand" href="/docs">
          One
        </a>
      </div>
      <nav aria-label="Docs navigation" className="docs-header__nav">
        <a href="/docs">Docs</a>
        <a href="/docs/components">Components</a>
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
