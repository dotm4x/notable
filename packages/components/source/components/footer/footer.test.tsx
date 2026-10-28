import { createRef } from 'react';
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Footer } from './footer.js';
import { Link } from '../link/link.js';
import { Footer as PublicFooter } from '../../index.js';

describe('Footer', () => {
  it('renders a footer element with the footer class', () => {
    render(<Footer data-testid="footer">Content</Footer>);

    const footer = screen.getByTestId('footer');
    expect(footer.tagName).toBe('FOOTER');
    expect(footer).toHaveClass('notable-footer');
  });

  it('exposes a contentinfo landmark when used at the page level', () => {
    render(<Footer>Site information</Footer>);

    expect(screen.getByRole('contentinfo')).toHaveTextContent(
      'Site information',
    );
  });

  it('renders with no optional regions', () => {
    render(<Footer data-testid="footer" />);

    expect(screen.getByTestId('footer')).toBeEmptyDOMElement();
  });

  it('forwards refs and native attributes to the root element', () => {
    const ref = createRef<HTMLElement>();
    render(
      <Footer ref={ref} id="site-footer" aria-label="Site" className="custom">
        Content
      </Footer>,
    );

    expect(ref.current).toBe(screen.getByRole('contentinfo'));
    expect(ref.current).toHaveAttribute('id', 'site-footer');
    expect(ref.current).toHaveAccessibleName('Site');
    expect(ref.current).toHaveClass('notable-footer', 'custom');
  });

  it('composes brand, navigation sections, and bottom content', () => {
    render(
      <Footer>
        <Footer.Content>
          <Footer.Brand>
            <p>Acme Studio builds tools for designers.</p>
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
        </Footer.Content>
        <Footer.Bottom>
          <span>© 2025 Acme Studio</span>
        </Footer.Bottom>
      </Footer>,
    );

    const footer = screen.getByRole('contentinfo');
    expect(
      within(footer).getByText('Acme Studio builds tools for designers.'),
    ).toBeInTheDocument();
    expect(within(footer).getByText('© 2025 Acme Studio')).toBeInTheDocument();
    expect(
      within(footer).getByRole('link', { name: 'Features' }),
    ).toHaveAttribute('href', '/features');
  });

  it('renders multiple navigation sections with their own headings', () => {
    render(
      <Footer>
        <Footer.Content>
          <Footer.Section>
            <Footer.Heading>Product</Footer.Heading>
            <Link href="/features">Features</Link>
          </Footer.Section>
          <Footer.Section>
            <Footer.Heading>Company</Footer.Heading>
            <Link href="/about">About</Link>
          </Footer.Section>
        </Footer.Content>
      </Footer>,
    );

    expect(
      screen.getByRole('heading', { level: 2, name: 'Product' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: 'Company' }),
    ).toBeInTheDocument();
  });

  it('renders the heading at the level selected with as', () => {
    render(
      <Footer>
        <Footer.Section>
          <Footer.Heading as="h3">Resources</Footer.Heading>
        </Footer.Section>
      </Footer>,
    );

    expect(
      screen.getByRole('heading', { level: 3, name: 'Resources' }),
    ).toBeInTheDocument();
  });

  it('keeps arbitrary content such as social links and actions', () => {
    render(
      <Footer>
        <Footer.Section>
          <Footer.Heading>Follow</Footer.Heading>
          <ul aria-label="Social">
            <li>
              <a
                href="https://example.com/social"
                aria-label="Example on social"
              >
                <svg aria-hidden="true" focusable="false" />
              </a>
            </li>
          </ul>
        </Footer.Section>
        <Footer.Bottom>
          <button type="button">Back to top</button>
        </Footer.Bottom>
      </Footer>,
    );

    expect(
      screen.getByRole('link', { name: 'Example on social' }),
    ).toHaveAttribute('href', 'https://example.com/social');
    expect(screen.getByRole('list', { name: 'Social' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Back to top' }),
    ).toBeInTheDocument();
  });

  it('forwards refs and class names for every subcomponent', () => {
    const contentRef = createRef<HTMLDivElement>();
    const brandRef = createRef<HTMLDivElement>();
    const sectionRef = createRef<HTMLDivElement>();
    const headingRef = createRef<HTMLElement>();
    const bottomRef = createRef<HTMLDivElement>();

    render(
      <Footer>
        <Footer.Content ref={contentRef} className="content-extra">
          <Footer.Brand ref={brandRef}>Brand</Footer.Brand>
          <Footer.Section ref={sectionRef}>
            <Footer.Heading ref={headingRef}>Links</Footer.Heading>
          </Footer.Section>
        </Footer.Content>
        <Footer.Bottom ref={bottomRef}>Legal</Footer.Bottom>
      </Footer>,
    );

    expect(contentRef.current).toHaveClass(
      'notable-footer__content',
      'content-extra',
    );
    expect(brandRef.current).toHaveClass('notable-footer__brand');
    expect(sectionRef.current).toHaveClass('notable-footer__section');
    expect(headingRef.current).toHaveClass('notable-footer__heading');
    expect(bottomRef.current).toHaveClass('notable-footer__bottom');
  });

  it('is exported from the public entry point', () => {
    expect(PublicFooter).toBe(Footer);
    expect(PublicFooter.Content).toBe(Footer.Content);
    expect(PublicFooter.Bottom).toBe(Footer.Bottom);
  });
});
