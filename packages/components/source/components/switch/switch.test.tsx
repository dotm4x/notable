import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Switch } from './switch.js';

const TRAVEL = 18;

function dragSwitch(toggle: HTMLElement, distance: number, cancel = false) {
  const options = { pointerId: 1, button: 0 };

  fireEvent.pointerDown(toggle, { ...options, clientX: 100 });
  fireEvent.pointerMove(toggle, { ...options, clientX: 100 + distance });
  if (cancel) {
    fireEvent.pointerCancel(toggle, { ...options, clientX: 100 + distance });
    return;
  }
  fireEvent.pointerUp(toggle, { ...options, clientX: 100 + distance });
  fireEvent.click(toggle);
}

function getControl(toggle: HTMLElement) {
  const control = toggle.closest<HTMLElement>('.notable-switch__control');
  if (!control) {
    throw new Error('Expected a switch control.');
  }
  return control;
}

describe('Switch', () => {
  beforeEach(() => {
    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(32);
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
      width: 14,
    } as DOMRect);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders a switch with an accessible label', () => {
    render(<Switch label="Enable notifications" name="notifications" />);

    const toggle = screen.getByRole('switch', {
      name: 'Enable notifications',
    });

    expect(toggle).toHaveAttribute('type', 'checkbox');
    expect(toggle).toHaveAttribute('name', 'notifications');
    expect(toggle).not.toBeChecked();
  });

  it('supports uncontrolled toggling and form submission', async () => {
    const user = userEvent.setup();

    render(
      <form aria-label="Preferences">
        <Switch label="Dark mode" name="darkMode" value="enabled" />
      </form>,
    );

    const toggle = screen.getByRole('switch', { name: 'Dark mode' });
    const form = document.querySelector('form');
    expect(toggle).not.toBeChecked();

    await user.click(toggle);

    expect(toggle).toBeChecked();
    if (!form) {
      throw new Error('Expected the switch to be rendered inside a form.');
    }
    expect(new FormData(form).get('darkMode')).toBe('enabled');
  });

  it('supports controlled checked values and native change handlers', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Switch
        aria-label="Automatic updates"
        checked={false}
        onChange={onChange}
      />,
    );

    const toggle = screen.getByRole('switch', { name: 'Automatic updates' });
    await user.keyboard('{Tab}');
    await user.keyboard(' ');

    expect(toggle).not.toBeChecked();
    expect(onChange).toHaveBeenCalledOnce();
  });

  it('supports disabled, required, and forwarded refs', () => {
    const ref = createRef<HTMLInputElement>();

    render(
      <Switch
        ref={ref}
        label="Required setting"
        disabled
        required
        defaultChecked
      />,
    );

    const toggle = screen.getByRole('switch', { name: 'Required setting' });

    expect(toggle).toBeDisabled();
    expect(toggle).toBeRequired();
    expect(toggle).toBeChecked();
    expect(ref.current).toBe(toggle);
  });

  it('associates descriptions, errors, and external ARIA descriptions', () => {
    render(
      <>
        <span id="external-help">Extra help</span>
        <Switch
          label="Share usage data"
          aria-describedby="external-help"
          description="Help improve the product."
          error="Consent is required."
        />
      </>,
    );

    const toggle = screen.getByRole('switch', { name: 'Share usage data' });
    const description = screen.getByText('Help improve the product.');
    const error = screen.getByText('Consent is required.');

    expect(toggle).toHaveAttribute('aria-invalid', 'true');
    expect(toggle).toHaveAttribute('aria-errormessage', error.id);
    expect(toggle.getAttribute('aria-describedby')).toBe(
      `external-help ${description.id} ${error.id}`,
    );
  });

  it('supports the invalid state without an error message', () => {
    render(<Switch aria-label="Invalid setting" invalid />);

    expect(
      screen.getByRole('switch', { name: 'Invalid setting' }),
    ).toHaveAttribute('aria-invalid', 'true');
  });

  it('supports keyboard focus and activation', async () => {
    const user = userEvent.setup();

    render(<Switch label="Keyboard setting" />);
    await user.tab();

    const toggle = screen.getByRole('switch', { name: 'Keyboard setting' });
    expect(toggle).toHaveFocus();
    await user.keyboard(' ');
    expect(toggle).toBeChecked();
  });

  describe('dragging', () => {
    it('turns on when dragged past the midpoint', () => {
      const onChange = vi.fn();
      render(<Switch label="Drag" onChange={onChange} />);
      const toggle = screen.getByRole('switch', { name: 'Drag' });

      dragSwitch(toggle, TRAVEL);

      expect(toggle).toBeChecked();
      expect(onChange).toHaveBeenCalledOnce();
    });

    it('turns off when dragged back past the midpoint', () => {
      render(<Switch label="Drag" defaultChecked />);
      const toggle = screen.getByRole('switch', { name: 'Drag' });

      dragSwitch(toggle, -TRAVEL);

      expect(toggle).not.toBeChecked();
    });

    it('settles back when released before the midpoint', () => {
      const onChange = vi.fn();
      render(<Switch label="Drag" onChange={onChange} />);
      const toggle = screen.getByRole('switch', { name: 'Drag' });

      dragSwitch(toggle, TRAVEL / 2 - 1);

      expect(toggle).not.toBeChecked();
      expect(onChange).not.toHaveBeenCalled();
    });

    it('tracks the pointer within the travel range', () => {
      render(<Switch label="Drag" />);
      const toggle = screen.getByRole('switch', { name: 'Drag' });
      const control = getControl(toggle);

      fireEvent.pointerDown(toggle, { pointerId: 1, button: 0, clientX: 100 });
      fireEvent.pointerMove(toggle, { pointerId: 1, clientX: 108 });
      expect(
        control.style.getPropertyValue('--notable-switch-drag-offset'),
      ).toBe('8px');
      expect(
        control.style.getPropertyValue('--notable-switch-drag-progress'),
      ).toBe(`${(8 / TRAVEL) * 100}%`);
      expect(control).toHaveAttribute('data-dragging');

      fireEvent.pointerMove(toggle, { pointerId: 1, clientX: 400 });
      expect(
        control.style.getPropertyValue('--notable-switch-drag-offset'),
      ).toBe(`${TRAVEL}px`);
      expect(
        control.style.getPropertyValue('--notable-switch-drag-progress'),
      ).toBe('100%');
    });

    it('cleans up and keeps its state when cancelled', () => {
      const onChange = vi.fn();
      render(<Switch label="Drag" onChange={onChange} />);
      const toggle = screen.getByRole('switch', { name: 'Drag' });
      const control = getControl(toggle);

      dragSwitch(toggle, TRAVEL, true);

      expect(toggle).not.toBeChecked();
      expect(onChange).not.toHaveBeenCalled();
      expect(control).not.toHaveAttribute('data-dragging');
      expect(
        control.style.getPropertyValue('--notable-switch-drag-offset'),
      ).toBe('');
      expect(
        control.style.getPropertyValue('--notable-switch-drag-progress'),
      ).toBe('');
    });

    it('toggles natively on a click without dragging', async () => {
      const user = userEvent.setup();
      render(<Switch label="Drag" />);
      const toggle = screen.getByRole('switch', { name: 'Drag' });

      await user.click(toggle);

      expect(toggle).toBeChecked();
    });

    it('does not toggle again from the click after a drag', () => {
      const onChange = vi.fn();
      render(<Switch label="Drag" onChange={onChange} />);
      const toggle = screen.getByRole('switch', { name: 'Drag' });

      dragSwitch(toggle, TRAVEL);
      expect(toggle).toBeChecked();
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('ignores dragging while disabled', () => {
      render(<Switch label="Drag" disabled />);
      const toggle = screen.getByRole('switch', { name: 'Drag' });

      fireEvent.pointerDown(toggle, { pointerId: 1, button: 0, clientX: 100 });
      fireEvent.pointerMove(toggle, { pointerId: 1, clientX: 118 });
      fireEvent.pointerUp(toggle, { pointerId: 1, clientX: 118 });

      expect(toggle).not.toBeChecked();
      expect(getControl(toggle)).not.toHaveAttribute('data-dragging');
    });

    it('follows the checked prop when controlled', () => {
      const onChange = vi.fn();
      render(<Switch label="Drag" checked={false} onChange={onChange} />);
      const toggle = screen.getByRole('switch', { name: 'Drag' });

      dragSwitch(toggle, TRAVEL);

      expect(onChange).toHaveBeenCalledOnce();
      expect(toggle).not.toBeChecked();
    });

    it('submits the dragged value with a form', () => {
      render(
        <form aria-label="Preferences">
          <Switch label="Drag" name="drag" value="on" />
        </form>,
      );
      const toggle = screen.getByRole('switch', { name: 'Drag' });
      const form = document.querySelector('form') as HTMLFormElement;

      dragSwitch(toggle, TRAVEL);

      expect(new FormData(form).get('drag')).toBe('on');
    });
  });
});
