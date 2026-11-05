'use client';

import { Footer, Link } from '@dotm4x/one/components';

export default function Full() {
  return (
    <Footer>
      <Footer.Content>
        <Footer.Brand>
          <strong>Acme Studio</strong>
          <p>Tools for designers who ship.</p>
        </Footer.Brand>
        <Footer.Section>
          <Footer.Heading>Product</Footer.Heading>
          <ul>
            <li>
              <Link href="/features">Features</Link>
            </li>
            <li>
              <Link href="/pricing">Pricing</Link>
            </li>
          </ul>
        </Footer.Section>
        <Footer.Section>
          <Footer.Heading>Company</Footer.Heading>
          <ul>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/careers">Careers</Link>
            </li>
          </ul>
        </Footer.Section>
      </Footer.Content>
      <Footer.Bottom>
        <span>© 2025 Acme Studio</span>
        <nav aria-label="Legal">
          <ul>
            <li>
              <Link href="/privacy">Privacy</Link>
            </li>
            <li>
              <Link href="/terms">Terms</Link>
            </li>
          </ul>
        </nav>
      </Footer.Bottom>
    </Footer>
  );
}
