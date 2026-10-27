import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Search, X } from 'lucide-react';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Input } from './input.js';

describe('Input', () => {
  it('renders an input associated with its label and forwards native attributes', () => {
    render(
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
      />,
    );

    const input = screen.getByRole('textbox', { name: 'Email' });

    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('placeholder', 'you@example.com');
    expect(input).toHaveAttribute('autocomplete', 'email');
  });

  it('supports native size, form attributes, and forwarded refs', () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <form aria-label="Profile">
        <Input
          ref={ref}
          label="Display name"
          name="displayName"
          size={24}
          defaultValue="Alex"
          required
        />
      </form>,
    );

    const input = screen.getByRole('textbox', { name: 'Display name' });
    const form = document.querySelector('form');

    expect(input).toHaveAttribute('size', '24');
    expect(input).toBeRequired();
    expect(ref.current).toBe(input);
    if (!form) {
      throw new Error('Expected the input to be rendered inside a form.');
    }
    expect(new FormData(form).get('displayName')).toBe('Alex');
  });

  it('supports uncontrolled and controlled values', async () => {
    const user = userEvent.setup();
    const ControlledInput = () => {
      const [value, setValue] = useState('initial');

      return (
        <Input
          aria-label="Controlled"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      );
    };

    render(
      <>
        <Input aria-label="Uncontrolled" defaultValue="start" />
        <ControlledInput />
      </>,
    );

    const uncontrolled = screen.getByRole('textbox', { name: 'Uncontrolled' });
    const controlled = screen.getByRole('textbox', { name: 'Controlled' });

    expect(uncontrolled).toHaveValue('start');
    await user.clear(uncontrolled);
    await user.type(uncontrolled, 'updated');
    expect(uncontrolled).toHaveValue('updated');

    await user.clear(controlled);
    await user.type(controlled, 'changed');
    expect(controlled).toHaveValue('changed');
  });

  it('supports disabled and read-only states', () => {
    render(
      <>
        <Input aria-label="Disabled" disabled />
        <Input aria-label="Read only" readOnly value="Cannot edit" />
      </>,
    );

    expect(screen.getByRole('textbox', { name: 'Disabled' })).toBeDisabled();
    expect(screen.getByRole('textbox', { name: 'Read only' })).toHaveAttribute(
      'readonly',
    );
  });

  it('associates descriptions, errors, and existing descriptions accessibly', () => {
    render(
      <>
        <span id="external-help">External help</span>
        <span id="external-error">External error detail</span>
        <Input
          label="Username"
          aria-describedby="external-help"
          aria-errormessage="external-error"
          description="Choose a public name"
          error="Name is already taken"
        />
      </>,
    );

    const input = screen.getByRole('textbox', { name: 'Username' });
    const description = screen.getByText('Choose a public name');
    const error = screen.getByText('Name is already taken');

    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute(
      'aria-errormessage',
      `external-error ${error.id}`,
    );
    expect(input.getAttribute('aria-describedby')).toBe(
      `external-help ${description.id} ${error.id}`,
    );
  });

  it('supports an invalid state without an error message', () => {
    render(<Input aria-label="Invalid field" invalid />);

    expect(
      screen.getByRole('textbox', { name: 'Invalid field' }),
    ).toHaveAttribute('aria-invalid', 'true');
  });

  it('preserves native aria-invalid values and reflects them visually', () => {
    render(<Input aria-label="Grammar field" aria-invalid="grammar" />);

    expect(
      screen.getByRole('textbox', { name: 'Grammar field' }),
    ).toHaveAttribute('aria-invalid', 'grammar');
    expect(
      screen.getByRole('textbox').closest('.notable-input-field'),
    ).toHaveAttribute('data-invalid');
  });

  it('renders optional leading and trailing icons as decorative content', () => {
    render(
      <Input
        aria-label="Search"
        leadingIcon={<Search data-testid="leading-icon" />}
        trailingIcon={<X data-testid="trailing-icon" />}
      />,
    );

    expect(screen.getByTestId('leading-icon').parentElement).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    expect(screen.getByTestId('trailing-icon').parentElement).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });

  it('keeps explicitly interactive icon content accessible and actionable', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Input
        aria-label="Search"
        trailingIcon={
          <button type="button" aria-label="Clear search" onClick={onClick}>
            <X />
          </button>
        }
        trailingIconInteractive
      />,
    );

    expect(screen.getByRole('button', { name: 'Clear search' })).toBeVisible();
    expect(screen.getByRole('button').parentElement).not.toHaveAttribute(
      'aria-hidden',
      'true',
    );
    await user.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('preserves keyboard focus and native input events', async () => {
    const user = userEvent.setup();
    render(<Input aria-label="Name" />);

    await user.tab();

    const input = screen.getByRole('textbox', { name: 'Name' });
    expect(input).toHaveFocus();

    fireEvent.change(input, { target: { value: 'Bodypop' } });
    expect(input).toHaveValue('Bodypop');
  });
});
