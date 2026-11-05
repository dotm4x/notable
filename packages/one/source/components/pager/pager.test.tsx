import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Pager as PublicPager } from '../../components/index.js';
import { Pager } from './pager.js';

describe('Pager', () => {
  it('renders both destinations with their direction labels', () => {
    render(
      <Pager
        next={{ href: '/docs/components', label: 'Components' }}
        previous={{ href: '/docs/installation', label: 'Installation' }}
      />,
    );

    expect(
      screen.getByRole('navigation', { name: 'Pagination' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Previous Installation' }),
    ).toHaveAttribute('href', '/docs/installation');
    expect(
      screen.getByRole('link', { name: 'Next Components' }),
    ).toHaveAttribute('href', '/docs/components');
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('supports custom direction labels and a custom landmark name', () => {
    render(
      <Pager
        label="Documentation pages"
        next={{ href: '/next', label: 'Next page' }}
        nextLabel="Siguiente"
      />,
    );

    expect(
      screen.getByRole('navigation', { name: 'Documentation pages' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Siguiente Next page' }),
    ).toBeInTheDocument();
  });

  it('renders only the available destination', () => {
    render(<Pager next={{ href: '/next', label: 'Next page' }} />);

    expect(screen.getAllByRole('link')).toHaveLength(1);
    expect(
      screen.getByRole('link', { name: 'Next Next page' }),
    ).toHaveAttribute('href', '/next');
  });

  it('renders nothing when both destinations are omitted', () => {
    const { container } = render(<Pager />);

    expect(container).toBeEmptyDOMElement();
    expect(
      screen.queryByRole('navigation', { name: 'Pagination' }),
    ).not.toBeInTheDocument();
  });

  it('forwards refs and native attributes', () => {
    const ref = createRef<HTMLElement>();
    render(
      <Pager
        className="custom"
        data-testid="pager"
        id="pager"
        next={{ href: '/next', label: 'Next page' }}
        ref={ref}
      />,
    );

    const pager = screen.getByTestId('pager');
    expect(pager).toHaveClass('one-pager', 'custom');
    expect(pager).toHaveAttribute('id', 'pager');
    expect(ref.current).toBe(pager);
  });

  it('is exported from the package entry point', () => {
    expect(PublicPager).toBe(Pager);
  });
});
