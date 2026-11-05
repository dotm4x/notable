'use client';

import { Footer, Link } from '@dotm4x/one/components';

export default function Transparent() {
  return (
    <div
      style={{
        width: '100%',
        padding: '24px',
        background: 'var(--one-color-surface-sunken, transparent)',
      }}
    >
      <Footer transparent>
        <Footer.Content>
          <Footer.Brand>
            <strong>Acme Studio</strong>
            <p>Documentation for every component in the library.</p>
          </Footer.Brand>
          <Footer.Section>
            <Footer.Heading as="h3">Resources</Footer.Heading>
            <ul>
              <li>
                <Link href="/docs">Documentation</Link>
              </li>
              <li>
                <Link href="/accessibility">Accessibility guidance</Link>
              </li>
            </ul>
          </Footer.Section>
        </Footer.Content>
        <Footer.Bottom>
          <span>Built with One</span>
        </Footer.Bottom>
      </Footer>
    </div>
  );
}
