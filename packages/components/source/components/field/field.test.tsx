import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Field } from './field.js';

describe('Field', () => {
  it('labels a control placed inside the field', () => {
    render(
      <Field.Root>
        <Field.Label>Email</Field.Label>
        <Field.Control />
      </Field.Root>,
    );

    expect(screen.getByLabelText('Email')).toBeInstanceOf(HTMLInputElement);
  });

  it('describes the control with its description', () => {
    render(
      <Field.Root>
        <Field.Label>Email</Field.Label>
        <Field.Control />
        <Field.Description>We never share it</Field.Description>
      </Field.Root>,
    );

    expect(
      screen.getByRole('textbox', { name: 'Email' }),
    ).toHaveAccessibleDescription('We never share it');
  });

  it('describes the control with an error that is always shown when matched', () => {
    render(
      <Field.Root invalid>
        <Field.Label>Email</Field.Label>
        <Field.Control />
        <Field.Error match>Enter an email address</Field.Error>
      </Field.Root>,
    );

    const control = screen.getByRole('textbox', { name: 'Email' });
    expect(control).toHaveAccessibleDescription('Enter an email address');
    expect(control).toHaveAttribute('aria-invalid', 'true');
  });

  it('marks the root as invalid when the field is invalid', () => {
    render(
      <Field.Root className="custom-field" data-testid="field" invalid>
        <Field.Control aria-label="Email" />
      </Field.Root>,
    );

    expect(screen.getByTestId('field')).toHaveAttribute('data-invalid');
    expect(screen.getByTestId('field')).toHaveClass(
      'notable-field',
      'custom-field',
    );
  });

  it('disables the control when the field is disabled', () => {
    render(
      <Field.Root disabled>
        <Field.Label>Email</Field.Label>
        <Field.Control />
      </Field.Root>,
    );

    expect(screen.getByRole('textbox', { name: 'Email' })).toBeDisabled();
  });
});
