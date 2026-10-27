import { createRef, type ReactNode } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Header } from './header.js';
import { Header as PublicHeader } from '../../index.js';

function scrollTo(y: number) {
  act(() => {
    window.scrollY = y;
    fireEvent.scroll(window);
  });
}

function renderDynamic(children: ReactNode = <button>Action</button>) {
  return render(
    <Header mode="dynamic" data-testid="header">
      {children}
    </Header>,
  );
}

describe('Header', () => {
  afterEach(() => {
    window.scrollY = 0;
  });

  it('renders a header element in normal mode by default', () => {
    render(<Header data-testid="header">Content</Header>);

    const header = screen.getByTestId('header');
    expect(header.tagName).toBe('HEADER');
    expect(header).toHaveClass('notable-header', 'notable-header--normal');
    expect(header).toHaveAttribute('data-mode', 'normal');
    expect(header).not.toHaveAttribute('data-state');
  });

  it('renders the fixed mode class without a dynamic state', () => {
    render(
      <Header mode="fixed" data-testid="header">
        Content
      </Header>,
    );

    const header = screen.getByTestId('header');
    expect(header).toHaveClass('notable-header--fixed');
    expect(header).toHaveAttribute('data-mode', 'fixed');
    expect(header).not.toHaveAttribute('data-state');
  });

  it('exposes a banner landmark when used at the page level', () => {
    render(<Header>Site navigation</Header>);

    expect(screen.getByRole('banner')).toHaveTextContent('Site navigation');
  });

  it('does not listen to scroll in normal or fixed mode', () => {
    const addSpy = vi.spyOn(window, 'addEventListener');

    const { unmount } = render(<Header>Normal</Header>);
    unmount();
    render(<Header mode="fixed">Fixed</Header>);

    const scrollCalls = addSpy.mock.calls.filter(([type]) => type === 'scroll');
    expect(scrollCalls).toHaveLength(0);
    addSpy.mockRestore();
  });

  it('starts attached and moves to floating after scrolling past the threshold', () => {
    renderDynamic();
    const header = screen.getByTestId('header');
    expect(header).toHaveAttribute('data-state', 'attached');

    scrollTo(120);
    expect(header).toHaveAttribute('data-state', 'floating');
    expect(header).toHaveClass('notable-header--floating');
  });

  it('hides after a sufficient downward scroll and reveals on upward scroll', () => {
    renderDynamic();
    const header = screen.getByTestId('header');

    scrollTo(120);
    scrollTo(200);
    expect(header).toHaveAttribute('data-state', 'hidden');
    expect(header).toHaveAttribute('inert');

    scrollTo(180);
    expect(header).toHaveAttribute('data-state', 'floating');
    expect(header).not.toHaveAttribute('inert');
  });

  it('stays floating until the downward scroll exceeds the hide distance', () => {
    renderDynamic();
    const header = screen.getByTestId('header');

    scrollTo(120);
    scrollTo(180);
    expect(header).toHaveAttribute('data-state', 'floating');

    scrollTo(200);
    expect(header).toHaveAttribute('data-state', 'hidden');
  });

  it('returns to attached at the top of the page', () => {
    renderDynamic();
    const header = screen.getByTestId('header');

    scrollTo(300);
    scrollTo(0);
    expect(header).toHaveAttribute('data-state', 'attached');
  });

  it('ignores small jitter below the hide distance', () => {
    renderDynamic();
    const header = screen.getByTestId('header');

    scrollTo(120);
    scrollTo(130);
    scrollTo(122);
    scrollTo(131);
    expect(header).toHaveAttribute('data-state', 'floating');
  });

  it('resets accumulated distance when the direction reverses', () => {
    renderDynamic();
    const header = screen.getByTestId('header');

    scrollTo(120);
    scrollTo(140);
    scrollTo(110);
    scrollTo(130);
    scrollTo(150);
    expect(header).toHaveAttribute('data-state', 'floating');
  });

  it('keeps children mounted across state changes', () => {
    renderDynamic(<button type="button">Action</button>);
    const before = screen.getByRole('button', { name: 'Action' });

    scrollTo(120);
    scrollTo(240);
    scrollTo(160);

    expect(screen.getByRole('button', { name: 'Action' })).toBe(before);
  });

  it('does not hide while focus is inside the header', () => {
    renderDynamic(<button type="button">Action</button>);
    const header = screen.getByTestId('header');
    const button = screen.getByRole('button', { name: 'Action' });

    scrollTo(120);
    act(() => {
      button.focus();
    });
    scrollTo(240);

    expect(header).toHaveAttribute('data-state', 'floating');
  });

  it('removes the scroll listener on unmount', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderDynamic();

    unmount();

    expect(removeSpy.mock.calls.some(([type]) => type === 'scroll')).toBe(true);
    removeSpy.mockRestore();
  });

  it('resets to attached and stops tracking when leaving dynamic mode', () => {
    const { rerender } = renderDynamic();
    scrollTo(120);
    scrollTo(240);

    rerender(
      <Header mode="normal" data-testid="header">
        <button type="button">Action</button>
      </Header>,
    );

    const header = screen.getByTestId('header');
    expect(header).not.toHaveAttribute('data-state');
    expect(header).not.toHaveAttribute('inert');

    scrollTo(400);
    expect(header).not.toHaveAttribute('data-state');
  });

  it('forwards refs and native attributes to the root element', () => {
    const ref = createRef<HTMLElement>();
    render(
      <Header
        ref={ref}
        mode="dynamic"
        id="site-header"
        aria-label="Site"
        className="custom"
      >
        Content
      </Header>,
    );

    expect(ref.current).toBe(screen.getByRole('banner'));
    expect(ref.current).toHaveAttribute('id', 'site-header');
    expect(ref.current).toHaveAttribute('aria-label', 'Site');
    expect(ref.current).toHaveClass('custom', 'notable-header');
  });

  it('is exported from the package entry point', () => {
    expect(PublicHeader).toBe(Header);
  });
});
