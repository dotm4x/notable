import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Shortcut, type ShortcutProps } from './shortcut.js';
import { Shortcut as PublicShortcut } from '../../index.js';

describe('Shortcut', () => {
  it('renders its children in a semantic kbd element', () => {
    render(<Shortcut>K</Shortcut>);

    const key = screen.getByText('K', { selector: 'kbd' });
    expect(key.tagName).toBe('KBD');
    expect(key).toHaveTextContent('K');
  });

  it.each(['Backspace', 'Page Down', 'Caps Lock'])(
    'renders the complete long key label %s',
    (label) => {
      render(<Shortcut>{label}</Shortcut>);

      expect(screen.getByText(label, { selector: 'kbd' })).toHaveTextContent(
        label,
      );
    },
  );

  it('forwards native attributes and custom classes', () => {
    render(
      <Shortcut
        className="custom-shortcut"
        id="shortcut"
        title="Open search"
        data-testid="shortcut"
        aria-label="Command K"
      >
        ⌘
      </Shortcut>,
    );

    const key = screen.getByTestId('shortcut');
    expect(key).toHaveClass('notable-shortcut', 'custom-shortcut');
    expect(key).toHaveAttribute('id', 'shortcut');
    expect(key).toHaveAttribute('title', 'Open search');
    expect(key).toHaveAccessibleName('Command K');
  });

  it('forwards its ref to the native kbd element', () => {
    const ref = createRef<HTMLElement>();
    render(<Shortcut ref={ref}>Enter</Shortcut>);

    expect(ref.current).toBe(screen.getByText('Enter', { selector: 'kbd' }));
  });

  it('is available from the public package entry point', () => {
    expect(PublicShortcut).toBe(Shortcut);
  });

  it('supports native HTML attributes in its props', () => {
    const props: ShortcutProps = { title: 'Escape key' };

    render(<Shortcut {...props}>Esc</Shortcut>);

    expect(screen.getByText('Esc', { selector: 'kbd' })).toHaveAttribute(
      'title',
      'Escape key',
    );
  });
});
