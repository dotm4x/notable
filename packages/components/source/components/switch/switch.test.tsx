import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Switch } from './switch.js';

describe('Switch', () => {
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
});
