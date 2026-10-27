import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Link } from './link.js';

describe('Link', () => {
  it('renders a native anchor with its href and accessible name', () => {
    render(<Link href="/docs">Read the docs</Link>);

    const link = screen.getByRole('link', { name: 'Read the docs' });
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/docs');
  });

  it('forwards the ref to the anchor element', () => {
    const ref = createRef<HTMLAnchorElement>();

    render(
      <Link ref={ref} href="/docs">
        Docs
      </Link>,
    );

    expect(ref.current).toBe(screen.getByRole('link', { name: 'Docs' }));
  });

  it('passes native anchor attributes and handlers through', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Link
        href="https://example.com"
        target="_blank"
        rel="noreferrer"
        onClick={onClick}
      >
        Example
      </Link>,
    );

    const link = screen.getByRole('link', { name: 'Example' });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noreferrer');

    await user.click(link);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('merges a custom className with the component classes', () => {
    render(
      <Link href="/docs" className="custom-link">
        Docs
      </Link>,
    );

    const link = screen.getByRole('link', { name: 'Docs' });
    expect(link).toHaveClass('notable-link', 'custom-link');
  });

  it('omits the arrow by default', () => {
    const { container } = render(<Link href="/docs">Docs</Link>);

    expect(container.querySelector('.notable-link__arrow')).toBeNull();
    expect(container.querySelector('.notable-link--arrow')).toBeNull();
  });

  it('renders a decorative arrow that is hidden from assistive technology', () => {
    const { container } = render(
      <Link href="/docs" arrow>
        Docs
      </Link>,
    );

    const link = screen.getByRole('link', { name: 'Docs' });
    const arrow = container.querySelector('.notable-link__arrow');

    expect(link).toHaveClass('notable-link--arrow');
    expect(arrow).not.toBeNull();
    expect(arrow).toHaveAttribute('aria-hidden', 'true');
    expect(link).toHaveAccessibleName('Docs');
  });
});
