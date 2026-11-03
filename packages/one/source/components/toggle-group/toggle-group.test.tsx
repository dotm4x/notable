import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ToggleGroup } from '../../components/index.js';

describe('ToggleGroup', () => {
  it('animates group items on press', async () => {
    const user = userEvent.setup();

    render(
      <ToggleGroup type="multiple" aria-label="Text formatting">
        <ToggleGroup.Item value="bold">Bold</ToggleGroup.Item>
      </ToggleGroup>,
    );

    const toggle = screen.getByRole('button', { name: 'Bold' });

    await user.pointer({ keys: '[MouseLeft>]', target: toggle });
    await waitFor(() => {
      expect(toggle.style.transform).toContain('scale(0.97)');
    });
  });

  it('rejects empty item values', () => {
    expect(() =>
      render(
        <ToggleGroup type="single" aria-label="Text alignment">
          <ToggleGroup.Item value="">Empty</ToggleGroup.Item>
        </ToggleGroup>,
      ),
    ).toThrow('ToggleGroup values must be non-empty strings.');
  });

  it('rejects empty selected values', () => {
    expect(() =>
      render(
        <ToggleGroup type="multiple" aria-label="Text formatting" value={['']}>
          <ToggleGroup.Item value="bold">Bold</ToggleGroup.Item>
        </ToggleGroup>,
      ),
    ).toThrow('ToggleGroup values must be non-empty strings.');
  });

  it('rejects empty default values', () => {
    expect(() =>
      render(
        <ToggleGroup type="single" aria-label="Text alignment" defaultValue="">
          <ToggleGroup.Item value="left">Left</ToggleGroup.Item>
        </ToggleGroup>,
      ),
    ).toThrow('ToggleGroup values must be non-empty strings.');
  });

  it('renders a named group and its toggle buttons', () => {
    render(
      <ToggleGroup
        type="multiple"
        aria-label="Text formatting"
        variant="outline"
        size="small"
      >
        <ToggleGroup.Item value="bold">Bold</ToggleGroup.Item>
        <ToggleGroup.Item value="italic">Italic</ToggleGroup.Item>
      </ToggleGroup>,
    );

    expect(
      screen.getByRole('group', { name: 'Text formatting' }),
    ).toBeInTheDocument();

    const bold = screen.getByRole('button', { name: 'Bold' });
    expect(bold).toHaveAttribute('aria-pressed', 'false');
    expect(bold).toHaveClass('one-toggle--outline', 'one-toggle--small');
    expect(screen.getByRole('button', { name: 'Italic' })).toHaveClass(
      'one-toggle--outline',
      'one-toggle--small',
    );
  });

  it('selects and clears one value in single mode', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <ToggleGroup
        type="single"
        aria-label="Text alignment"
        defaultValue="left"
        onValueChange={onValueChange}
      >
        <ToggleGroup.Item value="left">Left</ToggleGroup.Item>
        <ToggleGroup.Item value="center">Center</ToggleGroup.Item>
      </ToggleGroup>,
    );

    const left = screen.getByRole('button', { name: 'Left' });
    const center = screen.getByRole('button', { name: 'Center' });

    await user.click(center);

    expect(left).toHaveAttribute('aria-pressed', 'false');
    expect(center).toHaveAttribute('aria-pressed', 'true');
    expect(onValueChange).toHaveBeenLastCalledWith('center');

    await user.click(center);

    expect(center).toHaveAttribute('aria-pressed', 'false');
    expect(onValueChange).toHaveBeenLastCalledWith(null);
  });

  it('keeps multiple values selected in multiple mode', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <ToggleGroup
        type="multiple"
        aria-label="Text formatting"
        defaultValue={['bold']}
        onValueChange={onValueChange}
      >
        <ToggleGroup.Item value="bold">Bold</ToggleGroup.Item>
        <ToggleGroup.Item value="italic">Italic</ToggleGroup.Item>
      </ToggleGroup>,
    );

    const bold = screen.getByRole('button', { name: 'Bold' });
    const italic = screen.getByRole('button', { name: 'Italic' });

    await user.click(italic);

    expect(bold).toHaveAttribute('aria-pressed', 'true');
    expect(italic).toHaveAttribute('aria-pressed', 'true');
    expect(onValueChange).toHaveBeenLastCalledWith(['bold', 'italic']);

    await user.click(bold);

    expect(bold).toHaveAttribute('aria-pressed', 'false');
    expect(onValueChange).toHaveBeenLastCalledWith(['italic']);
  });

  it('does not drift from controlled values', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <ToggleGroup
        type="multiple"
        aria-label="Text formatting"
        value={['bold']}
        onValueChange={onValueChange}
      >
        <ToggleGroup.Item value="bold">Bold</ToggleGroup.Item>
        <ToggleGroup.Item value="italic">Italic</ToggleGroup.Item>
      </ToggleGroup>,
    );

    await user.click(screen.getByRole('button', { name: 'Italic' }));

    expect(screen.getByRole('button', { name: 'Bold' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('button', { name: 'Italic' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    expect(onValueChange).toHaveBeenCalledWith(['bold', 'italic']);
  });

  it('keeps single selection controlled and supports clearing it', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { rerender } = render(
      <ToggleGroup
        type="single"
        aria-label="Text alignment"
        value="left"
        onValueChange={onValueChange}
      >
        <ToggleGroup.Item value="left">Left</ToggleGroup.Item>
        <ToggleGroup.Item value="center">Center</ToggleGroup.Item>
      </ToggleGroup>,
    );

    await user.click(screen.getByRole('button', { name: 'Center' }));

    expect(screen.getByRole('button', { name: 'Left' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(onValueChange).toHaveBeenLastCalledWith('center');

    rerender(
      <ToggleGroup
        type="single"
        aria-label="Text alignment"
        value={null}
        onValueChange={onValueChange}
      >
        <ToggleGroup.Item value="left">Left</ToggleGroup.Item>
        <ToggleGroup.Item value="center">Center</ToggleGroup.Item>
      </ToggleGroup>,
    );

    expect(screen.getByRole('button', { name: 'Left' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    expect(screen.getByRole('button', { name: 'Center' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('disables the group and individual items', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { unmount } = render(
      <ToggleGroup
        type="multiple"
        aria-label="Managed formatting"
        disabled
        onValueChange={onValueChange}
      >
        <ToggleGroup.Item value="bold">Bold</ToggleGroup.Item>
      </ToggleGroup>,
    );

    const groupDisabledButton = screen.getByRole('button', { name: 'Bold' });
    expect(groupDisabledButton).toBeDisabled();
    await user.click(groupDisabledButton);
    expect(onValueChange).not.toHaveBeenCalled();

    unmount();
    render(
      <ToggleGroup
        type="multiple"
        aria-label="Text formatting"
        onValueChange={onValueChange}
      >
        <ToggleGroup.Item value="bold" disabled>
          Bold
        </ToggleGroup.Item>
        <ToggleGroup.Item value="italic">Italic</ToggleGroup.Item>
      </ToggleGroup>,
    );

    const itemDisabledButton = screen.getByRole('button', { name: 'Bold' });
    expect(itemDisabledButton).toBeDisabled();
    await user.click(itemDisabledButton);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('moves focus with the vertical orientation', async () => {
    const user = userEvent.setup();

    render(
      <ToggleGroup
        type="multiple"
        orientation="vertical"
        aria-label="Text formatting"
      >
        <ToggleGroup.Item value="bold">Bold</ToggleGroup.Item>
        <ToggleGroup.Item value="italic">Italic</ToggleGroup.Item>
      </ToggleGroup>,
    );

    const bold = screen.getByRole('button', { name: 'Bold' });
    const italic = screen.getByRole('button', { name: 'Italic' });

    await user.tab();
    expect(bold).toHaveFocus();

    await user.keyboard('{ArrowDown}');

    expect(italic).toHaveFocus();
  });
});
