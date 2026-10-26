import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from './checkbox.js';

describe('Checkbox', () => {
  it('renders an accessible native checkbox with its label', () => {
    render(<Checkbox label="Accept terms" name="terms" value="accepted" />);

    const checkbox = screen.getByRole('checkbox', { name: 'Accept terms' });

    expect(checkbox).toHaveAttribute('type', 'checkbox');
    expect(checkbox).toHaveAttribute('name', 'terms');
    expect(checkbox).toHaveAttribute('value', 'accepted');
  });

  it('supports uncontrolled interaction and form submission', async () => {
    const user = userEvent.setup();

    render(
      <form aria-label="Preferences">
        <Checkbox label="Email updates" name="updates" value="yes" />
      </form>,
    );

    const checkbox = screen.getByRole('checkbox', { name: 'Email updates' });
    const form = document.querySelector('form');

    expect(checkbox).not.toBeChecked();
    await user.click(screen.getByText('Email updates'));

    expect(checkbox).toBeChecked();
    if (!form) {
      throw new Error('Expected the checkbox to be rendered inside a form.');
    }
    expect(new FormData(form).get('updates')).toBe('yes');
  });

  it('supports controlled checked state and change handlers', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Checkbox
        aria-label="Enable notifications"
        checked={false}
        onChange={onChange}
      />,
    );

    const checkbox = screen.getByRole('checkbox', {
      name: 'Enable notifications',
    });
    await user.click(checkbox);

    expect(onChange).toHaveBeenCalledOnce();
    expect(checkbox).not.toBeChecked();
  });

  it('exposes the indeterminate state through the native checkbox', () => {
    const { rerender } = render(
      <Checkbox aria-label="Select all items" indeterminate />,
    );
    const checkbox = screen.getByRole('checkbox', {
      name: 'Select all items',
    });

    expect(checkbox).toHaveProperty('indeterminate', true);
    expect(checkbox).toBePartiallyChecked();
    expect(checkbox).not.toHaveAttribute('aria-checked');

    rerender(<Checkbox aria-label="Select all items" />);

    expect(checkbox).toHaveProperty('indeterminate', false);
    expect(checkbox).not.toBePartiallyChecked();
  });

  it('supports disabled, required, and forwarded ref attributes', () => {
    const ref = createRef<HTMLInputElement>();

    render(
      <Checkbox
        ref={ref}
        label="Required choice"
        disabled
        required
        defaultChecked
      />,
    );

    const checkbox = screen.getByRole('checkbox', { name: 'Required choice' });

    expect(checkbox).toBeDisabled();
    expect(checkbox).toBeRequired();
    expect(checkbox).toBeChecked();
    expect(ref.current).toBe(checkbox);
  });

  it('associates descriptions and preserves existing described-by IDs', () => {
    render(
      <>
        <span id="external-description">Additional help</span>
        <Checkbox
          label="Share profile"
          aria-describedby="external-description"
          description="Your profile will be visible to other members."
        />
      </>,
    );

    const checkbox = screen.getByRole('checkbox', { name: 'Share profile' });
    const description = screen.getByText(
      'Your profile will be visible to other members.',
    );

    expect(checkbox.getAttribute('aria-describedby')).toBe(
      `external-description ${description.id}`,
    );
  });

  it('preserves keyboard focus and native input events', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<Checkbox label="Keyboard option" onChange={onChange} />);

    await user.tab();
    const checkbox = screen.getByRole('checkbox', { name: 'Keyboard option' });
    expect(checkbox).toHaveFocus();

    await user.keyboard(' ');

    expect(checkbox).toBeChecked();
    expect(onChange).toHaveBeenCalledOnce();
  });

  it('forwards native change events', () => {
    const onChange = vi.fn();
    render(<Checkbox aria-label="Changeable" onChange={onChange} />);

    fireEvent.click(screen.getByRole('checkbox', { name: 'Changeable' }));

    expect(onChange).toHaveBeenCalledOnce();
  });
});
