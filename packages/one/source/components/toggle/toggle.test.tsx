import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Toggle } from '../../components/index.js';

const motionPreference = vi.hoisted(() => ({ reduced: false }));

vi.mock('motion/react', async (importOriginal) => ({
  ...(await importOriginal<typeof import('motion/react')>()),
  useReducedMotion: () => motionPreference.reduced,
}));

afterEach(() => {
  motionPreference.reduced = false;
});

describe('Toggle', () => {
  it('scales on press', async () => {
    const user = userEvent.setup();
    render(<Toggle>Bold</Toggle>);

    const toggle = screen.getByRole('button', { name: 'Bold' });

    await user.pointer({ keys: '[MouseLeft>]', target: toggle });
    await waitFor(() => {
      expect(toggle.style.transform).toContain('scale(0.97)');
    });
  });

  it('skips scale feedback when disabled or reduced motion is preferred', async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();
    const { rerender } = render(<Toggle disabled>Bold</Toggle>);
    let toggle = screen.getByRole('button', { name: 'Bold' });

    await user.hover(toggle);
    expect(toggle.style.transform).not.toContain('scale');

    motionPreference.reduced = true;
    rerender(<Toggle onPressedChange={onPressedChange}>Bold</Toggle>);
    toggle = screen.getByRole('button', { name: 'Bold' });

    await user.click(toggle);

    expect(toggle.style.transform).not.toContain('scale');
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
    expect(onPressedChange).toHaveBeenCalledWith(true);
  });

  it('toggles its pressed state and reports the new value', async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();

    render(
      <Toggle onPressedChange={onPressedChange} aria-label="Bold">
        Bold
      </Toggle>,
    );

    const toggle = screen.getByRole('button', { name: 'Bold' });
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    expect(toggle).toHaveAttribute('type', 'button');

    await user.click(toggle);

    expect(toggle).toHaveAttribute('aria-pressed', 'true');
    expect(onPressedChange).toHaveBeenCalledWith(true);
  });

  it('does not drift from a controlled pressed value', async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();

    render(
      <Toggle pressed={false} onPressedChange={onPressedChange}>
        Bold
      </Toggle>,
    );

    const toggle = screen.getByRole('button', { name: 'Bold' });
    await user.click(toggle);

    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    expect(onPressedChange).toHaveBeenCalledWith(true);
  });

  it('disables interaction when disabled', async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();

    render(
      <Toggle disabled onPressedChange={onPressedChange}>
        Bold
      </Toggle>,
    );

    const toggle = screen.getByRole('button', { name: 'Bold' });
    expect(toggle).toBeDisabled();

    await user.click(toggle);

    expect(onPressedChange).not.toHaveBeenCalled();
  });

  it.each(['default', 'outline'] as const)(
    'supports the %s variant',
    (variant) => {
      render(<Toggle variant={variant}>Bold</Toggle>);

      expect(screen.getByRole('button', { name: 'Bold' })).toHaveClass(
        `one-toggle--${variant}`,
      );
    },
  );

  it.each(['small', 'medium', 'large'] as const)(
    'supports the %s size',
    (size) => {
      render(<Toggle size={size}>Bold</Toggle>);

      expect(screen.getByRole('button', { name: 'Bold' })).toHaveClass(
        `one-toggle--${size}`,
      );
    },
  );
});
