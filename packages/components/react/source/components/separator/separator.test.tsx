import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Separator } from './separator.js';
import { Separator as PublicSeparator } from '../../index.js';

function renderSeparator(
  props: Parameters<typeof Separator>[0] = {},
): HTMLElement {
  const { container } = render(<Separator {...props} />);
  const element = container.firstElementChild;

  if (!(element instanceof HTMLElement)) {
    throw new Error('Expected Separator to render an HTML element');
  }

  return element;
}

describe('Separator', () => {
  it('renders a horizontal semantic separator by default', () => {
    // Arrange, Act
    const separator = renderSeparator();

    // Assert
    expect(separator.tagName).toBe('DIV');
    expect(separator).toHaveClass(
      'notable-separator',
      'notable-separator--horizontal',
    );
    expect(separator).toHaveAttribute('role', 'separator');
    expect(separator).toHaveAttribute('aria-orientation', 'horizontal');
  });

  it('renders a vertical separator with matching orientation semantics', () => {
    const separator = renderSeparator({ orientation: 'vertical' });

    expect(separator).toHaveClass(
      'notable-separator',
      'notable-separator--vertical',
    );
    expect(separator).not.toHaveClass('notable-separator--horizontal');
    expect(separator).toHaveAttribute('role', 'separator');
    expect(separator).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('is exposed as a separator to assistive technology when not decorative', () => {
    renderSeparator({ orientation: 'vertical' });

    expect(screen.getByRole('separator')).toHaveAttribute(
      'aria-orientation',
      'vertical',
    );
  });

  it('removes a decorative separator from the semantic tree', () => {
    // Arrange, Act
    const separator = renderSeparator({ decorative: true });

    // Assert
    expect(separator).toHaveAttribute('role', 'none');
    expect(separator).not.toHaveAttribute('aria-orientation');
    expect(screen.queryByRole('separator')).not.toBeInTheDocument();
  });

  it('keeps decorative separators free of extra ARIA attributes', () => {
    const separator = renderSeparator({
      decorative: true,
      orientation: 'vertical',
    });

    expect(
      separator.getAttributeNames().filter((name) => name.startsWith('aria-')),
    ).toEqual([]);
  });

  it('is not focusable', () => {
    const separator = renderSeparator();

    expect(separator).not.toHaveAttribute('tabindex');
    expect(separator).toBeEmptyDOMElement();
  });

  it('applies a numeric thickness as pixels', () => {
    const separator = renderSeparator({ thickness: 4 });

    expect(
      separator.style.getPropertyValue('--notable-separator-thickness'),
    ).toBe('4px');
  });

  it('passes a string thickness through as CSS', () => {
    const separator = renderSeparator({ thickness: '0.25rem' });

    expect(
      separator.style.getPropertyValue('--notable-separator-thickness'),
    ).toBe('0.25rem');
  });

  it('leaves thickness to the stylesheet default when not provided', () => {
    const separator = renderSeparator();

    expect(
      separator.style.getPropertyValue('--notable-separator-thickness'),
    ).toBe('');
  });

  it.each([
    ['subtle', 'var(--notable-color-border-subtle)'],
    ['default', 'var(--notable-color-border)'],
    ['strong', 'var(--notable-color-border-strong)'],
  ] as const)(
    'maps the %s color token to its border token',
    (color, expected) => {
      const separator = renderSeparator({ color });

      expect(
        separator.style.getPropertyValue('--notable-separator-color'),
      ).toBe(expected);
    },
  );

  it('passes a custom color through as CSS', () => {
    const separator = renderSeparator({
      color: 'var(--notable-color-primary)',
    });

    expect(separator.style.getPropertyValue('--notable-separator-color')).toBe(
      'var(--notable-color-primary)',
    );
    expect(separator).not.toHaveAttribute('color');
  });

  it('merges custom class names and forwards HTML attributes', () => {
    const separator = renderSeparator({
      className: 'custom-divider',
      id: 'section-divider',
      title: 'Section divider',
    });

    expect(separator).toHaveClass('notable-separator', 'custom-divider');
    expect(separator).toHaveAttribute('id', 'section-divider');
    expect(separator).toHaveAttribute('title', 'Section divider');
  });

  it('merges custom inline styles with the component variables', () => {
    const separator = renderSeparator({
      style: { marginBlock: '1rem' },
      thickness: 2,
    });

    expect(separator.style.marginBlock).toBe('1rem');
    expect(
      separator.style.getPropertyValue('--notable-separator-thickness'),
    ).toBe('2px');
  });

  it('renders inside a flex layout as a direct flex item', () => {
    const { container } = render(
      <div style={{ display: 'flex', height: 80 }}>
        <Separator orientation="vertical" />
      </div>,
    );
    const separator = container.querySelector('.notable-separator');

    expect(container.firstElementChild).toHaveStyle({ display: 'flex' });
    expect(separator?.parentElement).toBe(container.firstElementChild);
    expect(separator).toHaveClass('notable-separator--vertical');
  });

  it('is exported from the package entry point', () => {
    expect(PublicSeparator).toBe(Separator);
  });
});
