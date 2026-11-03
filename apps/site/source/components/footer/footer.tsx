'use client';

import { Footer, Link } from '@dotm4x/one';
import './footer.css';

export function SiteFooter() {
  return (
    <Footer aria-label="Site footer" className="site-footer" transparent>
      <p data-slot="footer-credit" className="site-footer__credit">
        Built by{' '}
        <Link href="https://github.com/dotm4x" target="_blank" rel="noreferrer">
          dotm4x
        </Link>
        . The source code is available on{' '}
        <Link
          href="https://github.com/dotm4x/one"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </Link>
      </p>
    </Footer>
  );
}
